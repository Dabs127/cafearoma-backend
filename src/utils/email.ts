import nodemailer from "nodemailer";

interface OptionValues {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (option: OptionValues) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dabsserna@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    const mailOption = {
      from: process.env.EMAIL_ID ?? "dabsserna@gmail.com",
      to: option.email,
      subject: option.subject,
      html: option.message,
    };
    await transporter.sendMail(mailOption);
  } catch (err) {
    console.log(err);
  }
};

const mailTemplate = (
  content: string,
  buttonUrl: string,
  buttonText: string
) => {
  return `<!DOCTYPE html>
  <html>
  <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
    <div
      style="
        max-width: 400px;
        margin: 10px;
        background-color: #fafafa;
        padding: 25px;
        border-radius: 20px;
      "
    >
      <p style="text-align: left;">
        ${content}
      </p>
      <a href="${buttonUrl}" target="_blank">
        <button
          style="
            background-color: #444394;
            border: 0;
            width: 200px;
            height: 30px;
            border-radius: 6px;
            color: #fff;
          "
        >
          ${buttonText}
        </button>
      </a>
      <p style="text-align: left;">
        If you are unable to click the above button, copy paste the below URL into your address bar
      </p>
      <a href="${buttonUrl}" target="_blank">
          <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
            ${buttonUrl}
          </p>
      </a>
    </div>
  </body>
</html>`;
};

export { sendEmail, mailTemplate };
