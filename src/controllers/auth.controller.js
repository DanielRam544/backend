// Importamos el modelo de datos
import User from '../models/user.models.js';

// Importamos módulo bcryptjs
import bcryptjs from 'bcryptjs';

// Importamos el archivo jwt.js
import { createAccessToken } from '../libs/jwt.js';

import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

// Función para registrar usuarios
export const register = async (req, res)=>{
    // Mandamos a consola el body del request
    // console.log(req.body);

    // Recibimos los datos para el registro del usuario
    const {username, email, password} = req.body;
    // console.log(username, email, password);

    // Creamos un nuevo usuario con los datos recibidos
    try{
        // Validamos que el email no este registrado en la base de datos
        const userFound = await User.findOne({email});

        if(userFound)
            return res.status(400).json({message: ['El email ya esta en uso.']});

        const passwordHash = await bcryptjs.hash(password, 10);

        const newUser = User({
            username,
            email,
            password: passwordHash
        });

        const userSaved = await newUser.save();

        // Generamos el Token con los datos del usuario
        const token = await createAccessToken({id: userSaved._id});
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        });

        // console.log(newUser);
        // res.json(userSaved);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        });
    } catch(error){
        console.log(error);
    }

    // res.send("Registrando");
}

// Función para iniciar sesión
export const login = async (req, res)=>{
    const {email, password} = req.body;

    try{
        const userFound = await User.findOne({email});

        if(!userFound){
            return res.status(400).json({message: ['Usuario no encontrado.']});
        }

        // Comparamos el password que envio el usuario con el de la base de datos
        const isMatch = await bcryptjs.compare(password, userFound.password);

        if(!isMatch){
            return res.status(400).json({message: ['Password no coincide.']});
        }

        const token = await createAccessToken({id: userFound._id});
        // res.cookie('token', token);
        res.cookie('token', token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true
        });

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    } catch(error){
        console.log(error);
    }
    // res.send("Login");
}

export const logout = (req, res)=>{
    res.cookie("token", "", {
        expires: new Date(0),
    });

    return res.sendStatus(200);
}

export const profile = async (req, res)=>{
    // console.log(req.user);

    // res.send("Profile");
    const userFound = await User.findById(req.user.id);

    if(!userFound){
        return res.status(400).json({message: ['User not found.']})
    }

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email
    })
}

// Función para crear un usuario
export const createUser = async (req, res) =>{
    try{
        const {username, email, password} = req.body;
        const passwordHash = await bcryptjs.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        res.json({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        });
    } catch(error){
        console.log(error);
        res.status(500).json({message: ['Error al crear un usuario.']})
    }
}

// Función para editar un usuario
export const editUser = async (req, res)=>{
    try{
        const {username, password} = req.body;
        const passwordHash = await bcryptjs.hash(password, 10);
        const user = await User.findByIdAndUpdate(req.params.id, {username: username, password: passwordHash}, {new: true});

        if(!user)
            return res.status(404).json({message: ['Usuario no encontrado.']})
        res.json(user);
    } catch(error){
        console.log(error);
        res.status(500).json({message: ['Error al actualizar al usuario.']})
    }
};

// Función para eliminar un usuario
export const deleteUser = async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user)
            res.status(400).json({message: ['Usuario no encontrado.']})
        res.json(user);
    } catch(error){
        console.log(error);
        res.status(500).json({message: ['Error al eliminar al usuario.']})
    }
};

// Función para obtener todos los usuarios
export const getUsers = async (req, res)=>{
    try{
        const users = await User.find();
        res.json(users);
    } catch(error){
        console.log(error);
        res.status(500).json({message: ['Error al obtener los usuarios.']});
    }
};

// Función para obtener un producto
export const getUser = async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);

        if(!user)
            return res.status(400).json({message: ['Usuario no encontrado.']})
        res.json(user);
    } catch(error){
        console.log(error);
        res.status(500).json({message: ['Error al otener el usuario.']})
    }
};

// Función para validar el token de inicio de sesión
export const verifyToken = async(req, res)=>{
    const {token} = req.cookies;

    if(!token)
        return res.status(401).json({message:['No autorizado.']});

    jwt.verify(token, TOKEN_SECRET, async(err, user)=>{
        if(err)
            return res.status(401).json({message:['No autorizado.']});

        const userFound = await User.findById(user.id);

        if(!userFound)
            return res.status(401).json({message:['No autorizado.']});

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        })
    })
}