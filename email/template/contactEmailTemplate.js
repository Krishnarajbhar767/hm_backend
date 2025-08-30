function contactEmailTemplate({ name, email, phone, subject, message }) {
  return `
    <!DOCTYPE html><html><head>
      <meta charset="UTF-8" />
      <title>New Contact Us Message</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { padding: 20px; border: 1px solid #ddd; }
        .header { background: #532E0D; color: #fff; padding: 10px; text-align: center; }
        .section { margin: 10px 0; }
        .section-title { font-weight: bold; margin-bottom: 5px; }
        .footer { font-size: 12px; color: #777; margin-top: 20px; text-align: center; }
      </style>
    </head><body>
      <div class="container">
        <div class="header"><h2>New Message from Contact Us Form</h2></div>
        <div class="section">
          <div class="section-title">Name:</div>
          <div>${name}</div>
        </div>
        <div class="section">
          <div class="section-title">Email:</div>
          <div>${email}</div>
        </div>
        <div class="section">
          <div class="section-title">Phone:</div>
          <div>${phone || "Not provided"}</div>
        </div>
        <div class="section">
          <div class="section-title">Subject:</div>
          <div>${subject}</div>
        </div>
        <div class="section">
          <div class="section-title">Message:</div>
          <div>${message}</div>
        </div>
        <div class="footer">This is an automated message from Himalaya Carpets website.</div>
      </div>
    </body></html>
  `;
}

module.exports = contactEmailTemplate;
