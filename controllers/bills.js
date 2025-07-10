import billModel from "../models/bills.js";
import userModel from "../models/user.js";
import mongoose from 'mongoose'
import { z } from "zod";

const createBillSchema = z.object({
    userId: z.string().min(1, "userId is required").regex(/^\w{24}$/, "Invalid userId format"),
    bills: z.array(z.number().positive("Bill amount must be positive")).min(1, "At least one bill is required")
});

const createBill = async (req, res) => {
    const parseResult = createBillSchema.safeParse(req.body);
    if (!parseResult.success) {
        console.log("[Error] Validation Create Bill: ", parseResult.error.errors)
        return res.status(400).json({
            message: "Validation Error",
        });
    }
    try {
        // await Promise.all(
        //     req.body.bills.map((val) =>
        //         billModel.create({
        //             user: req.body.userId,
        //             amount: val
        //         })
        //     )
        // )
        //Changed query to insertMany
        await billModel.insertMany(
            req.body.bills.map((val) => ({
                user: req.body.userId,
                amount: val,
            }))
        )

        return res.status(200).json({
            message: "Bill(s) created successfully",
        })
    } catch (error) {
        console.log("[Error] Create Bill: ", error);
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const payBillSchema = z.object({
    userId: z.string().min(1, "userId is required"),
    billIds: z.array(z.string().regex(/^\w{24}$/, "Invalid billId format")).min(1, "At least one billId is required")
});

const payBill = async (req, res) => {
    const parseResult = payBillSchema.safeParse(req.body);
    if (!parseResult.success) {
        console.log("[Error] Validation Pay Bill: ", parseResult.error.errors)
        return res.status(400).json({
            message: "Validation Error",
        });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { userId, billIds } = req.body;

        const bills = await billModel.find({ _id: { $in: billIds }, user: userId, status: 'pending' }).session(session)
        if (bills.length !== billIds.length) {
            throw new Error('Some bills are not found or not pending')
        }
        await billModel.updateMany(
            { _id: { $in: billIds }, user: userId, status: 'pending' },
            { $set: { status: 'processing' } },
            { session }
        )

        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
        const user = await userModel.findById(userId).session(session)
        if (!user) throw new Error('User not found')
        if (user.balance < totalAmount) {
            throw new Error('You dont have enough balance')
        }
        user.balance -= totalAmount;
        await user.save({ session })

        await billModel.updateMany(
            { _id: { $in: billIds }, user: userId, status: 'processing' },
            { $set: { status: 'paid' } },
            { session }
        )

        await session.commitTransaction()
        session.endSession()
        return res.status(200).json({ message: "Bills paid successfully" })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.log("[Error] Pay Bill: ", error)
        return res.status(400).json({ 
            message: error.message || "Server Error" 
        });
    }
}

export {
    createBill,
    payBill
}