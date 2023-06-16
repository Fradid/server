const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', [
	check('name', "Назва типу матеріалу має містити щонайменше 3 символи!").isLength({min: 3})
], authMiddleware, checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), typeController.del)

module.exports = router