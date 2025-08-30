const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "himalayacarpetsindia@gmail.com",
                pass: "kpuy pktd zkad pgpd",
            },
        });

        // send mail by using transporter
        let info = await transporter.sendMail({
            from: "Himalaya Carpets",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        return info;
    } catch (error) {
        console.log("Error From Mail Sender - >", error.message);
        throw new Error("Error While Sending The Email");
    }
};

module.exports = mailSender;
