const transporter = require("./Mail");

const sendEmail = async (to, sub, msg) => {
  const mailOptions = {
    from: {
      name: "Yasser E-store",
      address: process.env.USER,
    },
    to: [to],
    subject: sub,
    text: msg,
    // attachments: [
    //   {
    //     filename: "congratulation.png",
    //     path: "./public/congratulation.png",
    //     contentType: "image/png",
    //   },
    // ],
  };

  // await transporter.sendMail(mailOptions);
  // console.log(`Email has been sent to: ${to}, subject: ${sub}.`);
  // console.log(error);
  // if (error) {
  //   console.log(error);
  //   throw error;
  // }

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email has been sent to: ${to}, subject: ${sub}.`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
