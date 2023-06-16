const Router = require('express')
const router = new Router()
const specialtyController = require('../controllers/specialtyController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', [
	check('name', "Назва спеціальності має містити щонайменше 3 символи!").isLength({min: 3}),
], authMiddleware, checkRole('ADMIN'), specialtyController.create)
router.get('/', specialtyController.getAll)
router.put('/:id', [
	check('name', "Назва спеціальності має містити щонайменше 3 символи!").isLength({min: 3}),
], authMiddleware, checkRole('ADMIN'), specialtyController.update)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), specialtyController.del)

module.exports = router