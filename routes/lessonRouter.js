const Router = require('express')
const router = new Router()
const lessonController = require('../controllers/lessonController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', [
	check('name', "Назва уроку має містити щонайменше 3 символи!").isLength({min: 3}),
	check('annotationLink', "Анотація повинна містити покликання!").isURL(),
	check('userId', "Вкажіть ID викладача числом!").isNumeric(),
	check('specialtyId', "Вкажіть ID спеціальності числом!").isNumeric(),
	check('courseId', "Вкажіть ID курса числом!").isNumeric()
], authMiddleware, checkRole('ADMIN'), lessonController.create)
router.get('/', lessonController.getAll)
router.get('/:id', lessonController.getOne)
router.put('/:id', [
	check('name', "Назва уроку має містити щонайменше 3 символи!").isLength({min: 3}),
	check('annotationLink', "Анотація повинна містити покликання!").isURL(),
	check('userId', "Вкажіть ID викладача числом!").isNumeric(),
	check('specialtyId', "Вкажіть ID спеціальності числом!").isNumeric(),
	check('courseId', "Вкажіть ID курса числом!").isNumeric()
], authMiddleware, checkRole('ADMIN'), lessonController.update)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), lessonController.del)

module.exports = router