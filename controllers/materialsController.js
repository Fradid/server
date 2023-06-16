const { Materials, Links } = require("../models/models");
const ApiError = require("../error/ApiError");
const { validationResult } = require("express-validator");

class MaterialsController {
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
			let { name, lessonId, typeId, info } = req.body;

			const material = await Materials.create({ name, lessonId, typeId });

			if (info) {
				info = JSON.parse(info);
				const { presLink, docLink, videoLink } = info;
				await Links.create({
					presLink: presLink,
					docLink: docLink,
					videoLink: videoLink,
					materialId: material.id,
				});
			}

			return res.json(material);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async getAll(req, res) {
		let { lessonId, typeId, limit, page } = req.query;
		page = page || 1;
		limit = limit || 9;
		let offset = page * limit - limit;
		let materials;
		if (lessonId && typeId) {
			materials = await Materials.findAndCountAll({
				where: { lessonId, typeId },
				include: [{ model: Links, as: "info" }],
				limit,
				offset,
			});
		}
		if (lessonId && !typeId) {
			materials = await Materials.findAndCountAll({
				where: { lessonId },
				include: [{ model: Links, as: "info" }],
				limit,
				offset,
			});
		}
		return res.json(materials);
	}

	async getOne(req, res) {
		const { id } = req.params;
		const material = await Materials.findOne({
			where: { id },
			include: [{ model: Links, as: "info" }],
		});
		return res.json(material);
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
			let { name, lessonId, typeId, info } = req.body;
			const [numRowsUpdated, [updatedMaterials]] = await Materials.update(
				{ name, lessonId, typeId },
				{ where: { id }, returning: true }
			);

			if (info) {
				info = JSON.parse(info);
				const [linkUpdated, [updatedLinks]] = await Links.update(
					{
						presLink: info.presLink,
						docLink: info.docLink,
						videoLink: info.videoLink,
					},
					{ where: { materialId: id }, returning: true }
				);

				if (linkUpdated === 0) {
					return next(
						ApiError.badRequest(`Links with materialId -> ${id} not found`)
					);
				}
			}

			if (numRowsUpdated === 0) {
				return next(ApiError.badRequest(`Material with id -> ${id} not found`));
			}

			return res.json(updatedMaterials);
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}

	async del(req, res, next) {
		try {
			const { id } = req.params;

			const material = await Materials.findOne({
				where: { id },
				include: [{ model: Links, as: "info" }],
			});

			await material.info.destroy();
			await material.destroy();

			return res.json({ message: "Material deleted!" });
		} catch (e) {
			return next(ApiError.badRequest(e.message));
		}
	}
}

module.exports = new MaterialsController();
