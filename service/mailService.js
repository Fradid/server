const nodemailer = require("nodemailer");

class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		});
	}

	async sendPassword(to, password) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: "Запит на відновлення пароля",
			text: "",
			html: `
							<div>
								<h1>Ваш новий пароль!</h1>
								<h4>Пароль: ${password}</h4>
							</div>
						`,
		});
	}
}

module.exports = new MailService();
