import { TOKEN_SECRET } from "../config.js";
import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next)=>{
    // console.log("Validando token");

    // Imprimimos a consola los headers de la petición.
    // console.log(req.headers);

    // Obtenemos las cookies
    // const cookies = req.cookies;
    // console.log(cookies);

    // Obtenemos unicamente el token de la cookie
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message: ["No token, autorización denegada."]})
    }

    jwt.verify(token, TOKEN_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({message: ['Token inválido.']})
        }

        // Si no hay error imprimimos el usuario que inicio sesión
        // console.log(user);

        // Si no hay error guardamos los datos del usuario en el objeto req
        req.user = user;

        next();
    })
}