import mongoose from 'mongoose'

const connectDB = () => {
    new Promise((async (resolve, reject) => {
        try {
            const db = await mongoose.connect(process.env.MONGO_URI)
            if (process.env.NODE_ENV === 'development') mongoose.set('debug', true)
            
            console.log("Mongo Connected!")

            resolve(db)
        } catch (error) {
            console.log("Mongo Connection Error: ", error)
            reject(error)
        }
    }
))}

export default connectDB