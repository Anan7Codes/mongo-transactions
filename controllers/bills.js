import billModel from "../models/bills.js";
import { z } from "zod";
import { enqueuePaymentJob } from "../queue/payment.js";

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
        await Promise.all(
            req.body.bills.map((val) =>
                billModel.create({
                    user: req.body.userId,
                    amount: val
                })
            )
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
    enqueuePaymentJob({ userId: req.body.userId, billIds: req.body.billIds });
    return res.status(202).json({ message: "Payment scheduled" });
}

export {
    createBill,
    payBill
}