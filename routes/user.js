import express from 'express'
import { 
    insertUser,
    getAllUsers
} from "../controllers/user.js"

const router = express.Router()

router.get('/get-all', getAllUsers)
router.post("/create", insertUser)

export default router