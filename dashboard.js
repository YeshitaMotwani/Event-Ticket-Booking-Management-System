document.addEventListener('DOMContentLoaded', () => {
    const bookingList = document.getElementById('booking-list');
    bookingList.style.display = "flex";
    bookingList.style.flexDirection = "column";
    bookingList.style.alignItems = "center";

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const cancellations = JSON.parse(localStorage.getItem('cancellations')) || [];

    if (bookings.length === 0 && cancellations.length === 0) {
        bookingList.innerHTML = '<p style="font-size: 1.5rem; color: #555; text-align: center; margin-top: 20px;">No bookings or cancellations found. Please make a booking or cancel a ticket.</p>';
    } else {
        bookings.forEach((booking, index) => {
            const bookingDiv = document.createElement('div');
            bookingDiv.classList.add('booking-item');
            bookingDiv.style.border = "1px solid #ddd";
            bookingDiv.style.borderRadius = "1rem";
            bookingDiv.style.padding = "4px";
            bookingDiv.style.width = "40rem";
            bookingDiv.style.marginBottom = "1.25rem";
            bookingDiv.style.backgroundColor = "#f9f9f9";
            bookingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            
            bookingDiv.innerHTML = `
                <h3 style="font-size: 1.75rem; color: blue; margin: 0 0 10px;">Booking ${index + 1}</h3>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Event:</strong> ${booking.event}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Seats:</strong> ${booking.seats}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Total Price:</strong> Rs ${booking.totalPrice}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Show Timing:</strong> ${booking.showTime}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Booking Time:</strong> ${booking.bookingTime}</p>`;
            bookingList.appendChild(bookingDiv);
        });

        cancellations.forEach((cancellation, index) => {
            const cancellationDiv = document.createElement('div');
            cancellationDiv.classList.add('cancellation-item');
            cancellationDiv.style.border = "1px solid #ddd";
            cancellationDiv.style.borderRadius = "1rem";
            cancellationDiv.style.padding = "4px";
            cancellationDiv.style.width = "40rem";
            cancellationDiv.style.marginBottom = "1.25rem";
            cancellationDiv.style.backgroundColor = "#f9f9f9";
            cancellationDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

            cancellationDiv.innerHTML = `
                <h3 style="font-size: 1.75rem; color: red; margin: 0 0 10px;">Cancellation ${index + 1}</h3>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Event:</strong> ${cancellation.event}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Seat:</strong> ${cancellation.seat}</p>
                <p style="font-size: 1.15rem; margin: 5px 0;"><strong>Cancellation Time:</strong> ${cancellation.cancellationTime}</p>`;
            bookingList.appendChild(cancellationDiv);
        });
    }

    const homeButton = document.getElementById('home-button');
    homeButton.style.marginTop = "1rem";
    homeButton.style.marginBottom = "1.5rem";
    homeButton.style.padding = "0.75rem 1.2rem";
    homeButton.style.fontSize = "1.2rem";
    homeButton.style.color = "#fff";
    homeButton.style.backgroundColor = "red";
    homeButton.style.border = "none";
    homeButton.style.borderRadius = "7px";
    homeButton.style.cursor = "pointer";
    
    homeButton.addEventListener('click', () => {
        window.location.href = "index.html"; 
    });
}); 