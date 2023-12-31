import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema({
    id: { type: String, require: true },
    communityname: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    image: String,
    biography: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
})

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema)

export default Community