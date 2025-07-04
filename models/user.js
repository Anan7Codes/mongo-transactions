import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    balance: { type: Number, min: 0, required: true, default: 0 },
}, {
    timestamps: true,
    minimize: false
})

const userModel = mongoose.model("User", userSchema)

export default userModel