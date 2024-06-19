import dbLocal from "db-local";
const {Schema} = new dbLocal({path: './db'})
import crypto from 'crypto'


const User = Schema('User', {
    _id: {type: String, rquired: true},
    username: {type: String, rquired: true},
    password: {type: String, rquired: true}
})

export class UsrRepository{
    static create({username, password}){

        //validación
        if(typeof username != 'string') throw new Error('el usuario debe ser una cadena de texto')
        if(username.length <3) throw new Error ('usuario debe ser tener 3 caracteres')

        if(typeof password != 'string') throw new Error('la contraseña debe ser una cadena')
        if(username.length <3) throw new Error ('La contraseña debe contener 6 caracteres')
        
        //validar si el usuario ya está creado
        const user = User.finOne({username})
        if (user) throw new Error('¡el usuario ya existe!') 
        
        const id = crypto.randomUUID()

        User.create({
            _id: id,
            username,
            password
        }).save()
        return id
    }

    static login ({username, password}){}
}