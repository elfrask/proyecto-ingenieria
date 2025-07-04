import mongoose, {model, connect, Schema} from  "mongoose";
import {autoIncrement, initializeCounterModel} from "./mongooseAutoincrement";

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
}
connect(process.env.MONGO_URI as string);

const UserSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
    role: String,
})



// Evita la recompilación de modelos en desarrollo con Next.js
const User = mongoose.models.User || model("User", UserSchema);

export { User };