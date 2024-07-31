import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        avatar: {
            type: String,
            default: "https://picsum.photos/100/100",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("User", userSchema);
