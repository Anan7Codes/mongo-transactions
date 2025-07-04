import userModel from "../models/user.js";
import { z } from "zod";

const getAllUsers = async (req, res) => {
    try {
        return res.status(200).json({
            data: await userModel.find({})
        })
    } catch (error) {
        console.log("[Error] Get All Users: ", error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

const insertUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format")
});

const insertUser = async (req, res) => {
    const parseResult = insertUserSchema.safeParse(req.body);
    if (!parseResult.success) {
        console.log("[Error] Validation Insert User: ", parseResult.error.errors)
        return res.status(400).json({
            message: "Validation Error",
        });
    }
    try {
        const newUser = await userModel.create({
            name: req.body.name,
            email: req.body.email,
        })
        return res.status(200).json({
            data: newUser,
            message: "User created succcessfully!"
        })
    } catch (error) {
        console.log("[Error] Insert User: ", error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

export {
    getAllUsers,
    insertUser,
}