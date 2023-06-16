const { Lesson } = require("../models/models");
const ApiError = require("../error/ApiError");
const { validationResult } = require("express-validator");

class LessonController {
	async create(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({
						errors,
					})
				);
			}
			const { name, annotationLink, userId, specialtyId, courseId } = req.body;
			const lesson = await Lesson.create({
				name,
				annotationLink,
				userId,
				specialtyId,
				courseId,
			});

			return res.json(lesson);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res) {
		let { userId, specialtyId, courseId, limit, page } = req.query;
		page = page || 1;
		limit = limit || 9;
		let offset = page * limit - limit;
		let lessons;
		if (!userId && !specialtyId && !courseId) {
			lessons = await Lesson.findAndCountAll({ limit, offset });
		}
		if (userId && !specialtyId && !courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { userId },
				limit,
				offset,
			});
		}
		if (!userId && specialtyId && !courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { specialtyId },
				limit,
				offset,
			});
		}
		if (!userId && !specialtyId && courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { courseId },
				limit,
				offset,
			});
		}
		if (userId && !specialtyId && courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { userId, courseId },
				limit,
				offset,
			});
		}
		if (!userId && specialtyId && courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { specialtyId, courseId },
				limit,
				offset,
			});
		}
		if (userId && specialtyId && !courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { userId, specialtyId },
				limit,
				offset,
			});
		}
		if (userId && specialtyId && courseId) {
			lessons = await Lesson.findAndCountAll({
				where: { userId, specialtyId, courseId },
				limit,
				offset,
			});
		}
		return res.json(lessons);
	}

	async getOne(req, res) {
		const { id } = req.params;
		const lesson = await Lesson.findOne({
			where: { id },
		});
		return res.json(lesson);
	}

	async update(req, res, next) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return next(
					ApiError.badRequest({
						errors,
					})
				);
			}
			const { id } = req.params;
			const { name, annotationLink, userId, specialtyId, courseId } = req.body;
			const [numRowsUpdated, [updatedLesson]] = await Lesson.update(
				{ name, annotationLink, userId, specialtyId, courseId },
				{ where: { id }, returning: true }
			);

			if (numRowsUpdated === 0) {
				return next(ApiError.badRequest(`Lesson with id -> ${id} not found`));
			}

			return res.json(updatedLesson);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async del(req, res, next) {
		try {
			const { id } = req.params;
			const delete_lesson = await Lesson.destroy({ where: { id } });

			return res.json({ message: "Lesson deleted!" });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new LessonController();
