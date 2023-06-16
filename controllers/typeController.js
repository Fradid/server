const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');
const { validationResult } = require('express-validator');

class TypeController {
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
			const {name} = req.body
			const type = await Type.create({name})

			return res.json(type)
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}

	async getAll(req, res) {
		const types = await Type.findAll()
		return res.json(types)
	}

	async del(req, res, next) {
		try {
			const {id} = req.params
			const delete_type = await Type.destroy({where: {id}})

			return res.json({message: "Type deleted!"})
		} catch (e) {
			return next(ApiError.badRequest(e.message))
		}
	}
}

module.exports = new TypeController()