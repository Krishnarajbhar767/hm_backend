function loginAlertTemplate(
  userName = "User",
  device = "Unknown Device",
  location = "Unknown Location",
  ip = "0.0.0.0",
  time = new Date().toLocaleString()
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Login Alert - Himalaya Carpets</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
        xintegrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins&display=swap');
 
        body, table, td, a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          background: #f9f9f9;
          font-family: 'Poppins', sans-serif;
          color: #333;
        }
 
        .email-wrapper {
          width: 100%;
          background: url('https://img.freepik.com/free-vector/modern-luxury-mandala-background_1035-8326.jpg?semt=ais_hybrid&w=740.') no-repeat center center/cover;
          padding: 40px 10px;
        }
 
        .container {
          max-width: 600px;
          width: 100%;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          animation: fadeIn 1.2s ease-in-out;
        }
 
        .header {
          background: #850E4B;
          text-align: center;
          padding: 30px 20px;
        }
        .header h1 {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          color: #fff;
        }
        .header p {
          margin: 8px 0 0;
          color: #f3f3f3;
          font-size: 16px;
        }
 
        .content {
          padding: 30px 20px;
        }
        .content h2 {
          font-size: 26px;
          color: #850E4B;
          margin-bottom: 20px;
        }
 
        .info-box {
          background: #f4f4f4;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 15px;
          line-height: 1.6;
          animation: slideUp 1s ease-in-out;
        }
        .info-box p {
          margin: 8px 0;
        }
 
        .footer {
          background: #f0f0f0;
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #777;
        }
 
        .footer a {
          color: #850E4B;
          text-decoration: none;
          font-weight: bold;
        }
 
        .footer .contact-info {
          margin: 8px 0;
        }
 
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
 
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
 
        @media only screen and (max-width: 620px) {
          .container {
            width: 100% !important;
            border-radius: 0;
          }
          .header h1 {
            font-size: 28px;
          }
          .content h2 {
            font-size: 22px;
          }
          .footer {
            font-size: 12px;
            padding: 15px 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Himalaya Carpets</h1>
            <p>Indian Craftsmanship — Global Reach</p>
          </div>
          <!-- Content -->
          <div class="content">
            <h2>Hello, ${userName} 👋</h2>
            <p>We noticed a new login to your account with the following details:</p>
            <div class="info-box">
              <p><strong>📍 Location:</strong> ${location}</p>
              <p><strong>💻 Device:</strong> ${device}</p>
              <p><strong>🌐 IP Address:</strong> ${ip}</p>
              <p><strong>🕒 Time:</strong> ${time}</p>
            </div>
            <p>If this was you, no action is needed. If not, please <strong>reset your password immediately</strong> or contact support.</p>
          </div>
          <!-- Footer -->
          <div class="footer">
            <div class="contact-info">
              <i class="fa-solid fa-envelope"></i>
              <a href="mailto:himalayacarpetsindia@gmail.com">himalayacarpetsindia@gmail.com</a>
            </div>
            <div class="contact-info">
              <i class="fa-solid fa-phone"></i>
               +919918022212
            </div>
            <p>© ${new Date().getFullYear()} Himalaya Carpets. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
}

module.exports = loginAlertTemplate;
