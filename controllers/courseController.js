const {Course} = require('../models/models')
const ApiError = require('../error/ApiError');
const { validationResult } = require('express-validator');

class CourseController {
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
			const {number} = req.body
			const course = await Course.create({number})

			return res.json(course)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getAll(req, res) {
		const courses = await Course.findAll()
		return res.json(courses)
	}

	async del(req, res, next) {
		try {
			const {id} = req.params
			const delete_course = await Course.destroy({where: {id}})

			return res.json({message: "Course deleted!"})
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new CourseController()