const { Specialty } = require("../models/models");
const ApiError = require("../error/ApiError");
const { validationResult } = require("express-validator");

class SpecialtyController {
	async create(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({
						message: "Помилка при створенні спеціальності",
						errors,
					})
				);
			}
			const { name } = req.body;
			const specialty = await Specialty.create({ name });

			return res.json(specialty);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res) {
		const specialties = await Specialty.findAll();
		return res.json(specialties);
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
			const { name } = req.body;

			const [numRowsUpdated, [updatedSpecialty]] = await Specialty.update(
				{ name },
				{ where: { id }, returning: true }
			);

			if (numRowsUpdated === 0) {
				return next(
					ApiError.badRequest(`Specialty with id -> ${id} not found`)
				);
			}

			return res.json(updatedSpecialty);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async del(req, res, next) {
		try {
			const { id } = req.params;
			const delete_specialty = await Specialty.destroy({ where: { id } });

			return res.json({ message: "Specialty deleted!" });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new SpecialtyController();
