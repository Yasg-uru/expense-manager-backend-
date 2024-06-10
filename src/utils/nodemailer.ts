import nodemailer from "nodemailer";
const Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // service: process.env.SMPT_SERVICE,
  service: "yashpawar12122004@gmail.com",
  auth: {
    user: "yashpawar12122004@gmail.com",
    // user: process.env.SMPT_MAIL,
    pass: "nwxb yuwl uioz dzkc",
    // pass: 'yash1212204',
  },
});
export const sendResetMail=(email:string,token:string)=>{
    const resetLink = `http://localhost:5173/reset-password/${token}`;
  const mailOptions = {
    to: email,
    from: 'passwordreset@yourapp.com',
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetLink}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  return Transporter.sendMail(mailOptions);

}