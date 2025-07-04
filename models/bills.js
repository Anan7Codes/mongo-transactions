import mongoose from 'mongoose'

const billSchema = new mongoose.Schema({
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['pending', 'processing', 'paid'], required: true, default: 'pending' }
}, {
    timestamps: true,
    minimize: false
})

const billModel = mongoose.model("Bill", billSchema)

export default billModel