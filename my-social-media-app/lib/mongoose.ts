import mongoose from 'mongoose'

let isConnected = false

const connectToMongoDB = async () => {
    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL){
        console.log("The MongoDB url is not founded!")
    } else if(isConnected){
        console.log("MongoDB connection already established")
    }

    try {
        const mongoDBURL = process.env.MONGODB_URL ?  process.env.MONGODB_URL : ""
        await mongoose.connect(mongoDBURL)
        isConnected = true
        console.log("MongoDB connected")
    } catch (error){
        throw error
    }
}

export { connectToMongoDB }