document.addEventListener("DOMContentLoaded", () => {
    class PriorityQueue { //Min Heap -> Lowest price = Highest priority
        constructor() {
            this.items = []; //Initializes items array to an empty array
        }

        enqueue(row, price) {
            const newItem = { row, price };
            let added = false;
            for (let i = 0; i < this.items.length; i++) {
                if (price < this.items[i].price) { //Min Price - Max Priority
                    this.items.splice(i, 0, newItem); //Used to insert a seat(newItem) at ith index
                    added = true; //Seat added successfully
                    break;
                }
            }
            if (!added) { //!false = true 
                this.items.push(newItem); //Add new seat to items array
            }
        }

        dequeue() {
            return this.items.shift(); //Removes the 1st element of priority queue(Highest priority/lowest price)
        }

        isEmpty() {
            return this.items.length === 0; //Checks if priority queue is empty
        }

        getPrices() {
            return this.items.map(item => item.price); //Used to create a new array which stores prices of all the seats
        }
    }

    const seats = Array(8).fill().map(() => Array(8).fill(0)); //Makes all the seats available(set to 0) initially
    const seatMap = document.getElementById('seat-map');
    const selectedSeatsText = document.getElementById('selected-seats');
    const totalPriceText = document.getElementById('total-price');
    const cancelTicketsButton = document.getElementById('cancel-tickets');
    const eventSelect = document.getElementById('event');
    const quantityInput = document.getElementById('quantity');
    const proceedButton = document.getElementById('proceed');
    const seatSelectionDiv = document.querySelector('.seat-selection');
    const bookingModeSelect = document.getElementById('criteria');
    const bookTicketsButton = document.getElementById('book-tickets');
    const homeButton = document.getElementById('home-button');
    const dashboardButton = document.getElementById('dashboard-button');
    let bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || []; 
    // Retrieve the 'bookedSeats' data from localStorage and parse it as a JavaScript array.
    // If the data doesn't exist in localStorage, default to an empty array.
    // This ensures 'bookedSeats' always holds an array, even if no previous data is available.

    let selectedSeats = [];
    let totalPrice = 0; 
    let seatLimit = 0;
    const seatPrices = new PriorityQueue(); //Object creation of class Priority Queue

    seatPrices.enqueue(0, 210);  //objName.functionName(parameters); => Function call
    seatPrices.enqueue(1, 250);
    seatPrices.enqueue(2, 300);
    seatPrices.enqueue(3, 350);
    seatPrices.enqueue(4, 400);
    seatPrices.enqueue(5, 420);
    seatPrices.enqueue(6, 475);
    seatPrices.enqueue(7, 500);

    function displaySeats() {
        seatMap.innerHTML = '';
        for (let row = 0; row < seats.length; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('seat-row');

            const rowPrice = seatPrices.items[row]?.price;  //Optional chaining operator to check the hierarchy is valid or not.
            const priceLabel = document.createElement('div'); // Creates a new div for price label
            priceLabel.innerText = `Row ${row + 1} Price: Rs ${rowPrice}`; //Displays price label
            priceLabel.style.marginRight = '10px'; //Sets right margin of price label to 10px

            for (let col = 0; col < seats[row].length; col++) { //Iterates over cols
                const seat = document.createElement('div'); //Creates a new div for seat
                seat.classList.add('seat'); //Adds seat class to classList of seat
                seat.dataset.row = row; //Sets row of seat
                seat.dataset.col = col; //Sets col of seat
                seat.innerText = `${row + 1}-${col + 1}`; //Updates the inner text of seat

                if (seats[row][col] === 1 || bookedSeats.includes(seat.innerText)) { //Check if seat is booked
                    seat.classList.add('booked');  //Adds booked class to classlist of seat
                } 
                rowDiv.appendChild(seat); //Appends seat to rowDiv
            }

            seatMap.appendChild(priceLabel); //Appends price label to seat map
            seatMap.appendChild(rowDiv); //appends row div to seat map
        }
    }

    function updateSelectedSeats() {
        selectedSeatsText.innerText = selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'; // if selected seats > 0 then, it Concatenates selected seats seperated by commas(delimeter)
        totalPriceText.innerText = `Rs ${totalPrice}`; //Updates inner text of total price
    }

    proceedButton.addEventListener('click', () => {
        const event = eventSelect.value;
        const quantity = parseInt(quantityInput.value);
    
        if (!event || quantity <= 0) { //Event not selected or 0/-ve no. of seats entered to be booked
            alert('Please select a valid event and number of tickets.'); //Invalid details entered
            return;
        }
    
        seatLimit = quantity;
        selectedSeats = [];
        totalPrice = 0;
        const criteria = bookingModeSelect.value;
        let booked = false;
    
    
        for (let i = 0; i < seatPrices.items.length && !booked; i++) { // available seats
            const row = seatPrices.items[i]?.row;
    
            if (row === undefined) {
                console.error(`Row information is missing for seatPrices.items[${i}].`);
                continue;
            }

    
            if (criteria === "Group booking") {
                for (let j = 0; j <= seats[row].length - quantity; j++) { //quantity - no. of adjacent seats
                    const seatGroup = seats[row].slice(j, j + quantity);
                    if (seatGroup.every(seat => seat === 0) && seatGroup.every((_, idx) => !bookedSeats.includes(`${row + 1}-${j + idx + 1}`))) { //Checks if every seat in the row in available
                        for (let k = j; k < j + quantity; k++) { //Iterates over consecutive seats
                            seats[row][k] = 1; //Books those consecutive/adjacent seats
                            selectedSeats.push(`${row + 1}-${k + 1}`);
                            totalPrice += seatPrices.items[i]?.price || 0; //adds seat price to total price and stores in total price
                        }
                        booked = true;
                        break;
                    }
                }
            } else if (criteria === "None") {
                let bookedCount = 0;
                for (let j = 0; j < seats[row].length && bookedCount < quantity; j++) { //bookedCount - trackes no. of seats booked at the end of each iteration of for loop
                    if (seats[row][j] === 0 && !bookedSeats.includes(`${row + 1}-${j + 1}`)) {
                        seats[row][j] = 1;
                        selectedSeats.push(`${row + 1}-${j + 1}`);
                        totalPrice += seatPrices.items[i]?.price || 0;
                        bookedCount++; ///Increments bookedCount of seats as each seat gets booked
                    }
                }
                if (bookedCount === quantity) booked = true; //If required number of seats are booked, set booked as true
            }
        }
    
        if (!booked) {
            alert("Unable to fulfill the booking criteria with the current seating arrangement.");
        } else {
            const updatedBookedSeats = [...bookedSeats, ...selectedSeats]; //Merges/combines previously booked seats and currently selected seats
            localStorage.setItem('bookedSeats', JSON.stringify(updatedBookedSeats));
            // Convert the 'updatedBookedSeats' array to a JSON string and store it in localStorage under the key 'bookedSeats'.
            // This ensures the array is saved persistently in the browser, so it can be retrieved later.
            updateSelectedSeats();
            alert("Seats booked successfully!");
        }
    
        seatSelectionDiv.style.display = 'block';
        displaySeats();
    });


    if (cancelTicketsButton) {
        cancelTicketsButton.addEventListener('click', () => {
            if (bookedSeats.length === 0) {
                alert('No booked tickets to cancel.');
                return;
            }
    
            let cancelSeat = prompt(`Enter the seat number you want to cancel (e.g., '1-2'): \nBooked Seats: ${bookedSeats.join(', ')}`);
            
            if (cancelSeat && bookedSeats.includes(cancelSeat)) {
                bookedSeats = bookedSeats.filter(seat => seat !== cancelSeat);
                localStorage.setItem('bookedSeats', JSON.stringify(bookedSeats));

                const [row, col] = cancelSeat.split('-').map(Number); //'1-2' -> '1 2' -> 1 2
                if (seats[row - 1]) { //Checks row => subtract 1: 0 based indexing
                    seats[row - 1][col - 1] = 0; // Make seat available
                }

                // Reset selectedSeats and totalPrice
                selectedSeats = selectedSeats.filter(seat => seat !== cancelSeat); //Removes seat which is to be cancelled from selectedSeats array
                totalPrice = 0; // Reset total price

                selectedSeats = [];

                // Store cancellation data
                const cancellationData = {
                    event: eventSelect.value,
                    seat: cancelSeat,
                    cancellationTime: new Date().toLocaleString() //displays the current date and time and toLocaleString() converts it into a localized string based on the system's locale.
                };

                // Retrieve existing cancellations from local storage

                // Retrieve the 'cancellations' data from localStorage and parse it as a JavaScript array.
                // If the data doesn't exist in localStorage, default to an empty array.
                // This ensures 'cancellations' always holds an array, even if no previous cancellation data is available.
                const cancellations = JSON.parse(localStorage.getItem('cancellations')) || [];
                cancellations.push(cancellationData); // Add new cancellation
                localStorage.setItem('cancellations', JSON.stringify(cancellations)); // Update local storage

                updateSelectedSeats(); // Update the display of selected seats
                displaySeats(); // Refresh the seat display
            } else {
                alert('Invalid seat number or seat not booked.');
            }
        });
    }

    bookTicketsButton.addEventListener('click', function () { 
        const event = document.getElementById('event').value;
        const seatsSelected = selectedSeats.join(', '); 
        const totalPriceValue = totalPrice; 

        localStorage.setItem('selectedEvent', event);
        localStorage.setItem('selectedSeats', seatsSelected);
        localStorage.setItem('totalPrice', totalPriceValue);

        localStorage.setItem('bookedSeats', JSON.stringify([...bookedSeats, ...selectedSeats])); //Merges bookedSeats and selectedSeats array and JSON.stringify(): Converts the combined array into a JSON string because localStorage only stores strings.

        window.location.href = 'payment.html';
    });

    homeButton.addEventListener('click', () => {
        window.location.href = "index.html"; 
    });

    dashboardButton.addEventListener('click', () => {
        window.location.href = "dashboard.html";
    });

    const ticketList = document.getElementById('ticket-list');
    bookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || [];
    const selectedEvent = localStorage.getItem('selectedEvent');
    const totalPriceValue = localStorage.getItem('totalPrice');
    const bookingDate = new Date().toLocaleString(); 

    if (bookedSeats.length === 0) {
        ticketList.innerHTML = '<p>No booked tickets available.</p>';
        return;
    }

    bookedSeats.forEach(seat => {
        const qrCode = createQRCode(seat);
        const ticketDiv = document.createElement('div');
        ticketDiv.classList.add('ticket');

        ticketDiv.innerHTML = `<h3>Event: ${selectedEvent}</h3>
                               <p>Seat Number: ${seat}</p>
                               <p>Price: Rs ${totalPriceValue}</p>
                               <p>Booking Date: ${bookingDate}</p>
                               ${qrCode}`;

        ticketList.appendChild(ticketDiv);
    });

    displaySeats(); 

function createQRCode(seat) {
    return `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${seat}&size=100x100" alt="QR Code for ${seat}"/>`; //adds API for QR code
}
});
