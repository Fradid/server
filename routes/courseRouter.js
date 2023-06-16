const Router = require('express')
const router = new Router()
const courseController = require('../controllers/courseController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', [
	check('number', "Номер курсу має бути числом в діапазоні від 1 до 4!").isInt({ min: 1, max: 4 }),
], authMiddleware, checkRole('ADMIN'), courseController.create)
router.get('/', courseController.getAll)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), courseController.del)

module.exports = router