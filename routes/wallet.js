import express from 'express'
import { 
    topUpWallet
} from "../controllers/wallet.js"

const router = express.Router()

router.post('/topup', topUpWallet)

export default router