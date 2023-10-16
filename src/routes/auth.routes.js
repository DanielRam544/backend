import { Router } from "express";
import { login, register, logout, profile, createUser, editUser, deleteUser, getUsers, getUser, verifyToken } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";

// Importamos validateSchema
import { validateSchema } from "../middlewares/validator.middleware.js";

// Importamos el esuqema de validacion
import { registerSchema, loginSchema } from "../schemas/auth.schemas.js";

const router = Router();

router.get('/verify', verifyToken);

router.post('/register', validateSchema(registerSchema), register);

router.post('/login', validateSchema(loginSchema), login);

router.post('/logout', logout);

router.get('/profile', authRequired, profile);

// Crear un usuario
router.post('/usuario', authRequired, createUser);
// router.post('/usuario', createUser);

// Editar un usuario
router.put('/usuario/:id', authRequired, editUser);

// Eliminar un usuario
router.delete('/usuario/:id', authRequired, deleteUser);

// Obtener todos los productos
router.get('/usuario', authRequired, getUsers);

// Obtener un producto por Id
router.get('/usuario/:id', authRequired, getUser);

export default router;