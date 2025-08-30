function otpTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification - Himalaya Carpets</title>
      <!-- Font Awesome for icons -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" 
        xintegrity="sha512-4C6F0L9MdkruYK9lrI/dEPtl+H+3GkOfJtQgHSiP1cqfBCZDaXYHNPaAbeJaotZrSOcLZB7K9Yf7rQXGU6VTlA==" 
        crossorigin="anonymous" referrerpolicy="no-referrer" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto&display=swap');
    
        /* Base Reset */
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
          font-family: 'Roboto', sans-serif;
          color: #333;
        }
    
        /* Email Wrapper with Background */
        .email-wrapper {
          width: 100%;
          background: url('https://img.freepik.com/free-vector/modern-luxury-mandala-background_1035-8326.jpg?semt=ais_hybrid&w=740') no-repeat center center/cover;
          padding: 40px 10px;
        }
    
        /* Container for email content */
        .container {
          max-width: 600px;
          width: 100%;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          animation: containerFadeIn 1.2s ease-in-out;
        }
    
        /* Header Section */
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
    
        /* Content Section */
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .content h2 {
          font-size: 26px;
          color: #850E4B;
          margin-bottom: 20px;
        }
        .otp-box {
          display: inline-block;
          font-size: 32px;
          font-weight: bold;
          color: #850E4B;
          background: #f7f7f7;
          padding: 15px 25px;
          border-radius: 8px;
          letter-spacing: 3px;
          animation: otpSlideIn 1s ease-in-out;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 15px;
          line-height: 1.5;
          margin: 10px 0 0;
        }
    
        /* Footer Section */
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
        .footer .contact-info i {
          margin-right: 6px;
        }
    
        /* Animations */
        @keyframes containerFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes otpSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
    
        /* Responsive adjustments */
        @media only screen and (max-width: 620px) {
          .container {
            width: 100% !important;
            border-radius: 0;
          }
          .header h1 {
            font-size: 28px;
          }
          .header p {
            font-size: 14px;
          }
          .content h2 {
            font-size: 22px;
          }
          .otp-box {
            font-size: 28px;
            padding: 10px 20px;
          }
          .content p {
            font-size: 14px;
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
          <!-- Header Section -->
          <div class="header">
            <h1>Himalaya Carpets</h1>
            <p>Indian Craftsmanship — Global Reach</p>
          </div>
          <!-- Content Section -->
          <div class="content">
            <h2>Your One-Time Password (OTP)</h2>
            <div class="otp-box">${otp}</div>
            <p>This OTP is valid for <strong>5 minutes</strong>. Use it to verify your account. Do not share this code with anyone.</p>
          </div>
          <!-- Footer Section -->
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

module.exports = otpTemplate;
