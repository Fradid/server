const bcrypt = require('bcrypt')

class PasswordService {
	async generateRandomPassword() {
		const length = 10;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    const hashPassword = bcrypt.hashSync(password, 6);
    return { newPassword: password, hashPassword };
	}
}

module.exports = new PasswordService();
