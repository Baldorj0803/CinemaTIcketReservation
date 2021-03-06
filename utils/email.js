const nodemailer = require("nodemailer");
const fs = require("fs");
const Hogan = require("hogan.js");

let template = fs.readFileSync("./views/email.hjs", "utf-8");
let compiledTemplate = Hogan.compile(template);

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: `smtp.mailtrap.io`,
		port: 2525,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "134a47f56897db", // generated ethereal user
			pass: "16048aaad63397", // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Cinema" <cinema@gmail.com>', // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		// text: "Hello world?", // plain text body
		// html: options.message, // html body
		html: compiledTemplate.render(options.message),
	});

	// console.log("Message sent: %s", info.messageId);
	// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// // Preview only available when sending through an Ethereal account
	// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	return info;
};
module.exports = sendEmail;
