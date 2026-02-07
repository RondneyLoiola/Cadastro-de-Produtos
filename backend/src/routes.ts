import { Router } from 'express'
import CategoryController from './app/controllers/categoryController'

const router = Router()

router.post('/categories', CategoryController.store)
router.get('/categories', CategoryController.index)
router.get('/categories/:_id', CategoryController.show)
router.put('/categories/:_id', CategoryController.update)
router.delete('/categories/:_id', CategoryController.delete)

export default router
