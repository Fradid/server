const Router = require('express')
const router = new Router()
const materialsController = require('../controllers/materialsController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', [
	check('name', "Назва матеріалу до заняття має містити щонайменше 3 символи!").isLength({min: 3}),
	check('lessonId', "Вкажіть ID уроку числом!").isNumeric(),
	check('typeId', "Вкажіть ID типа матеріалу числом!").isNumeric(),
], authMiddleware, checkRole('TEACHER'), materialsController.create)
router.get('/', materialsController.getAll)
router.get('/:id', materialsController.getOne)
router.put('/:id', [
	check('name', "Назва матеріалу до заняття має містити щонайменше 3 символи!").isLength({min: 3}),
	check('lessonId', "Вкажіть ID уроку числом!").isNumeric(),
	check('typeId', "Вкажіть ID типа матеріалу числом!").isNumeric(),
], authMiddleware, checkRole('TEACHER'), materialsController.update)
router.delete('/:id', authMiddleware, checkRole('TEACHER'), materialsController.del)

module.exports = router