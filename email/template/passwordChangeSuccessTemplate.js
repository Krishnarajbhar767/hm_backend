function passwordChangeSuccessTemplate(userName = "User") {
  return `
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
   <title>Password Changed - Himalaya Carpets</title>
   <style>
     @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins&display=swap');

     body {
       margin: 0;
       padding: 0;
       background: #f9f9f9;
       font-family: 'Poppins', sans-serif;
       color: #333;
     }

     .email-wrapper {
       width: 100%;
       padding: 40px 10px;
       background: #f3f3f3;
     }

     .container {
       max-width: 600px;
       margin: 0 auto;
       background: #fff;
       border-radius: 10px;
       overflow: hidden;
       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
     }

     .header {
       background: #850E4B;
       color: #fff;
       text-align: center;
       padding: 30px 20px;
     }

     .header h1 {
       margin: 0;
       font-family: 'Playfair Display', serif;
       font-size: 30px;
     }

     .content {
       padding: 30px 20px;
       text-align: center;
     }

     .content h2 {
       color: #850E4B;
       font-size: 24px;
       margin-bottom: 15px;
     }

     .content p {
       font-size: 16px;
       line-height: 1.6;
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
   </style>
 </head>
 <body>
   <div class="email-wrapper">
     <div class="container">
       <!-- Header -->
       <div class="header">
         <h1>Himalaya Carpets</h1>
       </div>

       <!-- Content -->
       <div class="content">
         <h2>Password Changed Successfully</h2>
         <p>Hi ${userName},<br><br>Your account password has been changed successfully.</p>
         <p>If you didn’t make this change, please reset your password immediately or contact our support team.</p>
       </div>

       <!-- Footer -->
       <div class="footer">
         <p>Need help? <a href="mailto:himalayacarpetsindia@gmail.com">Contact Support</a></p>
         <p>© ${new Date().getFullYear()} Himalaya Carpets. All rights reserved.</p>
       </div>
     </div>
   </div>
 </body>
 </html>
 `;
}

module.exports = passwordChangeSuccessTemplate;
