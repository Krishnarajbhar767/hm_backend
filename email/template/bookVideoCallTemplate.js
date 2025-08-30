function bookVideoCallTemplate(
  name = "Customer",
  date = "Date",
  time = "Time"
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Video Call Booking Confirmation</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" 
        xintegrity="sha512-4C6F0L9MdkruYK9lrI/dEPtl+H+3GkOfJtQgHSiP1cqfBCZDaXYHNPaAbeJaotZrSOcLZB7K9Yf7rQXGU6VTlA==" 
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
          background: url('https://img.freepik.com/free-vector/modern-luxury-mandala-background_1035-8326.jpg?semt=ais_hybrid&w=740') no-repeat center center/cover;
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
          font-size: 36px; color: #fff;
        }
        .header p {
          margin: 8px 0 0; color: #f3f3f3; font-size: 16px;
        }
        .content {
          padding: 30px 20px; text-align: center;
        }
        .content h2 {
          font-size: 26px; color: #850E4B; margin-bottom: 20px;
        }
        .content p {
          font-size: 15px; line-height: 1.6;
        }
        .confirmation-box {
          background: #f7f7f7; padding: 20px; border-radius: 10px;
          display: inline-block; font-size: 17px; color: #333; margin-top: 20px;
        }
        .footer {
          background: #f0f0f0; padding: 20px; text-align: center;
          font-size: 13px; color: #777;
        }
        .footer a {
          color: #850E4B; text-decoration: none; font-weight: bold;
        }
        .footer .contact-info {
          margin: 8px 0;
        }
        .footer .contact-info i {
          margin-right: 6px;
        }
        @keyframes containerFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @media only screen and (max-width: 620px) {
          .container { border-radius: 0; }
          .header h1 { font-size: 28px; }
          .content h2 { font-size: 22px; }
          .confirmation-box { font-size: 15px; padding: 15px; }
          .footer { font-size: 12px; padding: 15px 10px; }
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
            <h2>Hi ${name}, your video call is confirmed!</h2>
            <div class="confirmation-box">
              <strong>Date:</strong> ${date}<br/>
              <strong>Time:</strong> ${time}<br/>
              <strong>Platform:</strong> Zoom (Link will be shared soon)
            </div>
            <p>We look forward to assisting you with our exquisite handmade carpets and personalized solutions.</p>
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

module.exports = bookVideoCallTemplate;
