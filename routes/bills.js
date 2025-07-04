import express from 'express'
import { 
    createBill,
    payBill
} from "../controllers/bills.js"

const router = express.Router()

router.post('/', createBill)
router.post('/pay', payBill)

export default router