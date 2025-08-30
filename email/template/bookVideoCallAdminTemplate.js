function bookVideoCallAdminTemplate(
  customerName = "Customer",
  email = "N/A",
  phone = "N/A",
  date = "Date",
  time = "Time",
  notes = "None"
) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>New Video Call Booking</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" 
      integrity="sha512-4C6F0L9MdkruYK9lrI/dEPtl+H+3GkOfJtQgHSiP1cqfBCZDaXYHNPaAbeJaotZrSOcLZB7K9Yf7rQXGU6VTlA==" 
      crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto&display=swap');
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse !important; }
      body {
        margin: 0; padding: 0; width: 100% !important; background: #f9f9f9;
        font-family: 'Roboto', sans-serif; color: #333;
      }
      .email-wrapper {
        width: 100%;
        background: #f9f9f9;
        padding: 40px 10px;
      }
      .container {
        max-width: 600px; background: #fff; border-radius: 12px;
        margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        animation: containerFadeIn 1.2s ease-in-out;
      }
      .header {
        background: #850E4B; text-align: center; padding: 30px 20px;
      }
      .header h1 {
        margin: 0; font-family: 'Playfair Display', serif;
        font-size: 30px; color: #fff;
      }
      .header p {
        margin: 8px 0 0; color: #f3f3f3; font-size: 16px;
      }
      .content {
        padding: 30px 20px;
      }
      .content h2 {
        font-size: 22px; color: #850E4B; margin-bottom: 20px;
      }
      .info-table {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 10px;
        overflow: hidden;
      }
      .info-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
      }
      .info-table td.label {
        font-weight: bold;
        background: #f8f8f8;
        width: 35%;
      }
      .footer {
        background: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 13px;
        color: #777;
      }
      @keyframes containerFadeIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
      @media only screen and (max-width: 620px) {
        .container { border-radius: 0; }
        .header h1 { font-size: 24px; }
        .content h2 { font-size: 18px; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>New Video Call Booking</h1>
          <p>Notification for Admin</p>
        </div>
        <!-- Content -->
        <div class="content">
          <h2>Customer Details</h2>
          <table class="info-table">
            <tr>
              <td class="label">Name</td>
              <td>${customerName}</td>
            </tr>
            <tr>
              <td class="label">Email</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td class="label">Phone</td>
              <td>${phone}</td>
            </tr>
            <tr>
              <td class="label">Preferred Date</td>
              <td>${date}</td>
            </tr>
            <tr>
              <td class="label">Preferred Time</td>
              <td>${time}</td>
            </tr>
            <tr>
              <td class="label">Notes</td>
              <td>${notes}</td>
            </tr>
          </table>
        </div>
        <!-- Footer -->
        <div class="footer">
          This is an automated notification from <strong>Himalaya Carpets</strong>. <br/>
          Please log in to the admin dashboard to manage appointments.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = bookVideoCallAdminTemplate;
