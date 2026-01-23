import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required !"],
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required !"]
    },
    name: {
        type: String,
        required: false,
        trim: true,
        default: null
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now,
        immutable: true
    }
});

const userModel = mongoose.model("auth_user", userSchema);

export default userModel;
