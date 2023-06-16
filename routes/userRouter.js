const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/register', [
	check('fullName', "ПІБ користувача має містити щонайменше 3 символи!").isLength({min: 3}),
	check('email', "Вкажіть правильну електронну пошту!").isEmail(),
	check('password', "Пароль повинен містити 8-18 символів!").isLength({min: 8, max: 18})
], authMiddleware, checkRole('ADMIN'), userController.create)
router.post('/login', [
	check('email', "Вкажіть правильну електронну пошту!").isEmail(),
	check('password', "Пароль повинен містити 8-18 символів!").isLength({min: 8, max: 18})
], userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/', authMiddleware, checkRole('ADMIN'), userController.getAll)
router.get('/:id', authMiddleware, checkRole('TEACHER'), userController.getInfo)
router.put('/:id', [
	check('fullName', "ПІБ користувача має містити щонайменше 3 символи!").isLength({min: 3}),
	check('email', "Вкажіть правильну електронну пошту!").isEmail(),
	check('password', "Пароль повинен містити 8-18 символів!").isLength({min: 8, max: 18})
], authMiddleware, checkRole(['TEACHER', 'ADMIN']), userController.update)
router.post('/forgot', [
	check('email', "Вкажіть правильну електронну пошту!").isEmail(),
], userController.forgotPassword)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), userController.del)

module.exports = router