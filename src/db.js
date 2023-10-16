import mongoose from 'mongoose';

export const connectDB = async()=>{
    try{
        const url = 'mongodb+srv://Daniel:Daniel.2023@tag.qoejfik.mongodb.net/?retryWrites=true&w=majority'
        // await mongoose.connect('mongodb://127.0.0.1/productos');
        await mongoose.connect(url);
        console.log('Base de datos conectada');
    } catch(error){
        console.log(error);
    }
}

