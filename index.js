import express from 'express'
import {PORT} from './config.js'
import { UsrRepository } from './user.repository.js'
const app = express()
app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, resp)=>{
    resp.render('example', {name: 'Yovanis'})
})

app.post('/login', async (req, resp)=>{
    const {username, password} = req.body

    try {
        const user = await UsrRepository.login({username, password})
        resp.send({user})
    } catch (error) {
        resp.status(401).send(error.message)
    }
})

app.post('/register', async (req, resp)=>{
    const {username, password} = req.body
    console.log(req.body)

    try {
        const id = await UsrRepository.create({username, password})
        resp.send({ id })
    } catch (error) {
        resp.status(400).send(error.message)
    }
})


app.post('/logout', (req, resp)=>{})
app.post('/protected', (req, resp)=>{})



app.listen(PORT, ()=>{
    console.log(`Run server on port on ${PORT}`)
})