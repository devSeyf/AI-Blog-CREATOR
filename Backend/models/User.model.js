import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },

    email: {
        type: String,
        unique: true,
        required: [true, "Please provide an email"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
},
{
    timestamps: true
}
)

export default mongoose.model("User", userSchema);