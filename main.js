




document.getElementById('appointmentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const number = document.getElementById('number').value;
  const date = document.getElementById('date').value;

  fetch('/api/book-appointment', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email,number, date })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert('Appointment booked successfully!');
      } else {
          alert('Failed to book appointment.');
      }
  })
  .catch(error => console.error('Error:', error));
});
