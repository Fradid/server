const { User } = require("../models/models");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const uuid = require("uuid");
const path = require("path");
const mailService = require("../service/mailService");
const passwordService = require("../service/passwordService");

const generateJwt = (id, fullName, email, role) => {
	return jwt.sign({ id, fullName, email, role }, process.env.SECRET_KEY, {
		expiresIn: "24h",
	});
};

class UserController {
	async create(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({ message: "Помилка при реєстрації", errors })
				);
			}
			const { fullName, email, password, role } = req.body;
			let fileName = null;
			if (req.files && req.files.image) {
				const { image } = req.files;
				fileName = uuid.v4() + ".jpg";
				image.mv(path.resolve(__dirname, "..", "images", fileName));
			}
			const candidate = await User.findOne({ where: { email } });
			if (candidate) {
				return next(
					ApiError.badRequest("Користувач з такими даними вже зареєстрований!")
				);
			}
			const hashPassword = await bcrypt.hash(password, 6);
			const user = await User.create({
				fullName,
				email,
				role,
				password: hashPassword,
				image: fileName,
			});
			return res.json({ user });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async login(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({ errors })
				);
			}
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return next(ApiError.internal("Користувач не знайдений!"));
			}
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return next(
					ApiError.internal("Логін або пароль вказано не правильно!")
				);
			}
			const token = generateJwt(user.id, user.fullName, user.email, user.role);
			return res.json({ token });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async check(req, res, next) {
		const token = generateJwt(
			req.user.id,
			req.user.fullName,
			req.user.email,
			req.user.role
		);
		return res.json({ token });
	}

	async getAll(req, res, next) {
		try {
			const users = await User.findAll({ where: { role: "TEACHER" } });
			return res.json(users);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async getInfo(req, res, next) {
		try {
			const { id } = req.params;
			const user = await User.findOne({ where: { id } });
			if (!user) {
				return next(ApiError.badRequest("Користувач не знайдений!"));
			}
			return res.json(user);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async update(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({ errors })
				);
			}
			const { id } = req.params;
			const { fullName, email, password, role } = req.body;
			let fileName = null;
			if (req.files && req.files.image) {
				const { image } = req.files;
				fileName = uuid.v4() + ".jpg";
				image.mv(path.resolve(__dirname, "..", "images", fileName));
			}

			const user = await User.findOne({ where: { id, role: "TEACHER" } });
			if (!user) {
				return next(ApiError.badRequest("Користувач не знайдений!"));
			}

			const hashPassword = password
				? await bcrypt.hash(password, 6)
				: user.password;
			await User.update(
				{ fullName, email, password: hashPassword, image: fileName },
				{ where: { id } }
			);

			const updatedUser = await User.findOne({
				where: { id, role: "TEACHER" },
			});
			const token = generateJwt(
				updatedUser.id,
				updatedUser.fullName,
				updatedUser.email,
				updatedUser.role
			);
			return res.json({ token });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async forgotPassword(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({ errors })
				);
			}
			const { email } = req.body;
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return next(
					ApiError.badRequest(
						"Користувач з такою електронною адресою не знайдений!"
					)
				);
			}

			const { newPassword, hashPassword } =
				await passwordService.generateRandomPassword();
			await User.update({ password: hashPassword }, { where: { id: user.id } });

			await mailService.sendPassword(user.email, newPassword);

			return res.json({
				message: "Новий пароль був надісланий на вашу електронну адресу.",
			});
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async del(req, res, next) {
		try {
			const { id } = req.params;
			const delete_user = await User.destroy({ where: { id } });

			return res.json({ message: "User deleted!" });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new UserController();
