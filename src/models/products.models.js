import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0.0,
        required: true
    },
    year: {
        type: Number,
        default: 2023,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});

export default mongoose.model('Products', productSchema);