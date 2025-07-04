import mongoose from 'mongoose';
import billModel from '../models/bills.js';
import userModel from '../models/user.js';

export async function processPaymentJob({ userId, billIds }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const bills = await billModel.find({ _id: { $in: billIds }, user: userId, status: 'pending' }).session(session);
        if (bills.length !== billIds.length) {
            throw new Error('Some bills are not found or not pending');
        }
        await billModel.updateMany(
            { _id: { $in: billIds }, user: userId, status: 'pending' },
            { $set: { status: 'processing' } },
            { session }
        );
        const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        const user = await userModel.findById(userId).session(session);
        if (!user) throw new Error('User not found');
        if (user.balance < totalAmount) {
            throw new Error('You dont have enough balance');
        }
        user.balance -= totalAmount;
        await user.save({ session });
        await billModel.updateMany(
            { _id: { $in: billIds }, user: userId, status: 'processing' },
            { $set: { status: 'paid' } },
            { session }
        );
        await session.commitTransaction();
        session.endSession();
        console.log("Bills are successfully paid for user: ", userId);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("[Error] Pay Bill (queue) Error:", error);
        // To Handle Failed Jobs -> Retry? and then notify and investigate
    }
}

const paymentQueue = [];
let isProcessing = false;

export function enqueuePaymentJob(job) {
    paymentQueue.push(job);
    processQueue();
}

async function processQueue() {
    if (isProcessing || paymentQueue.length === 0) return;
    isProcessing = true;
    const job = paymentQueue.shift();
    try {
        await processPaymentJob(job);
    } catch (err) {
        console.error("[Error] Payment job error:", err);
    }
    isProcessing = false;
    processQueue();
}