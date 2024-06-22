import dbLocal from "db-local";
const {Schema} = new dbLocal({path: './db'})
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUND } from "./config";

const User = Schema('User', {
    _id: {type: String, rquired: true},
    username: {type: String, rquired: true},
    password: {type: String, rquired: true}
})

export class UsrRepository{
    static async create({username, password}){

        //validación
        Validation.username(username)
        Validation.password(password)

        //validar si el usuario ya está creado
        const user = User.findOne({username})
        if (user) throw new Error('¡el usuario ya existe!') 
        
        const id = crypto.randomUUID()
        const hashedpassword = await bcrypt.hash(password, SALT_ROUND);

        User.create({
            _id: id,
            username,
            password: hashedpassword 
        }).save()
        return id
    }

    static async login ({username, password}){
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({username})
        if(!user) throw new Error('El usuario no existe')

        const isValid = await bcrypt.compare(password, user.password)
        if(!isValid)  throw new Error ('Contraseña incorrecta')

        const {password: _, ...publicUser} = user 

        return publicUser
    }
}

class Validation{
    static username (username){
        if(typeof username != 'string') throw new Error('el usuario debe ser una cadena de texto')
        if(username.length <3) throw new Error ('usuario debe ser tener 3 caracteres')
    }

    static password(password){
        if(typeof password != 'string') throw new Error('la contraseña debe ser una cadena')
        if(username.length <3) throw new Error ('La contraseña debe contener 6 caracteres')
    }
}