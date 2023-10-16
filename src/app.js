import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Importamos las rutas para usuarios
import authRoutes from './routes/auth.routes.js';

// Importamos las rutas para los productos
import productRoutes from './routes/products.routes.js';

const app = express();

app.use(cors({
    origin:[
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    credentials: true
}));

app.use(morgan('dev'));

// Indicamos que se recibiran datos en formato JSON
app.use(express.json());

// Indicamos que las cookies se conviertan a JSON
app.use(cookieParser());

// Indicamos que el servidor utilice el objeto authRoutes
app.use('/api/', authRoutes);

// Indicamos que el servidor utilice el objeto productRoutes
app.use('/api/', productRoutes);

export default app;