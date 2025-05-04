require("dotenv").config();
import nodemailer from "nodemailer";

let sendResetPasswordEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Trần Huy Mobile" <trieuvuha124@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin mật khẩu của bạn!", // Subject line
        html: `
            <h3>Xin chào ${dataSend.userName}!</h3>
            <p>Mật khẩu mới của bạn là: ${dataSend.newPassword}</p>
        `, // html body
    });
};

module.exports = {
    sendResetPasswordEmail,
};
