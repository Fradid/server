const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const lessonRouter = require('./lessonRouter')
const materialsRouter = require('./materialsRouter')
const typeRouter = require('./typeRouter')
const specialtyRouter = require('./specialtyRouter')
const courseRouter = require('./courseRouter')

router.use('/user', userRouter)
router.use('/lesson', lessonRouter)
router.use('/material', materialsRouter)
router.use('/type', typeRouter)
router.use('/specialty', specialtyRouter)
router.use('/course', courseRouter)

module.exports = router