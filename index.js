import express from 'express'
import {PORT, SECRET_JWT_KEY} from './config.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { UserRepository } from './user.repository.js'
const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')

app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = {user: null}

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        req.session.user = data
    } catch{}

    next() //seguir a la sig ruta o middleware
})

app.get('/', (req, res)=>{
    const { user } = req.session
    res.render('index', user)
})

app.post('/login', async (req, res)=>{
    const {username, password} = req.body

    try {
        const user = await UserRepository.login({username, password})
        const token = jwt.sign({ id: username._id, username: user.username}, SECRET_JWT_KEY,{
            expiresIn: '1h'
        })
        res
        .cookie('access_token', token,{
            httpOnly: true, //permite que la cookie solo se pueda acceder desde el servidor 
            secure: process.env.NODE_ENV === 'production', //la cookie solo se puede acceder en https
            sameSite: 'strict', //la cooki solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60 // tiempo de validez de la cookie 1 hora
        })
        .send({user, token})
    } catch (error) {
        res.status(401).send(error.message)
    }
})

app.post('/register', async (req, res)=>{
    const {username, password} = req.body
    console.log(req.body)

    try {
        const id = await UserRepository.create({username, password})
        res.send({ id })
    } catch (error) {
        res.status(401).send(error.message)
    }
})


app.post('/logout', (req, res)=>{
    res.clearCookie('access_token')
    .json({ message: 'Sessión finalizada'})
})

app.get('/protected', (req, res)=>{

    const { user } = req.session
    if(!user) return res.status(403).send('Error, ¡accesso no autorizado!')
    res.render('protected', user)
    
})



app.listen(PORT, ()=>{
    console.log(`Run server on port on ${PORT}`)
})