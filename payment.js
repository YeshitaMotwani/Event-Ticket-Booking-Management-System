document.addEventListener('DOMContentLoaded', () => {

    const eventName = localStorage.getItem('eventName');
    const seatNumbers = localStorage.getItem('seatNumbers');
    const totalPrice = localStorage.getItem('totalPrice');

    
    document.getElementById('event-name').textContent = eventName;
    document.getElementById('seat-numbers').textContent = seatNumbers;
    document.getElementById('total-price').textContent = `Rs ${totalPrice}`;
    
    const eventTime = "Date: 2024-12-31, Time: 7:00 PM"; 
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    document.getElementById('complete-payment').addEventListener('click', () => {
        
        alert("Payment Successful!");

        
        const ticketDetails = `
            <strong>Event:</strong> ${eventName}<br>
            <strong>Seats:</strong> ${seatNumbers}<br>
            <strong>Total Price:</strong> ${totalPrice}<br>
            <strong>Payment Method:</strong> ${paymentMethod}<br>
            <strong>Event Time:</strong> ${eventTime}
        `;
        
        
        const qrCodeContainer = document.createElement('div');
        $(qrCodeContainer).qrcode({
            text: ticketDetails,
            width: 128,
            height: 128
        });

        
        const ticketContent = `
            <div style="text-align: center;">
                <h2>Your Ticket</h2>
                <p>${ticketDetails}</p>
                <div id="qrCodeContainer">${qrCodeContainer.innerHTML}</div>
            </div>
        `;
        
        const ticketElement = document.createElement('div');
        ticketElement.innerHTML = ticketContent;
        document.body.appendChild(ticketElement);
    });
});
