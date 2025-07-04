import userModel from "../models/user.js";
import { z } from "zod";

const topUpWalletSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    amount: z.number().positive("Amount must be a positive number")
});

const topUpWallet = async (req, res) => {
    const parseResult = topUpWalletSchema.safeParse(req.body);
    if (!parseResult.success) {
        console.log("[Error] Validation Top Up Wallet: ", parseResult.error.errors)
        return res.status(400).json({
            message: "Validation Error",
        });
    }
    try {
        if(req.body.amount < 0) {
            return res.status(400).json({
                message: "Cannot top up this amount"
            })
        }
        // IDEALLY ID HERE
        const newUser = await userModel.findOneAndUpdate({
            email: req.body.email
        }, {
            $inc: {
                balance: req.body.amount
            }
        })
        return res.status(200).json({
            data: newUser,
            message: "Wallet topped up succcessfully!"
        })
    } catch (error) {
        console.log("[Error] Top Up Wallet: ", error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

export {
    topUpWallet
}