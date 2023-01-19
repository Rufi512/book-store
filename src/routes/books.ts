import { Router } from "express";
import {list,book} from '../controllers/books_controller'
const router = Router()

router.get('/list',list)

router.get('/show/:id',book)

export default router