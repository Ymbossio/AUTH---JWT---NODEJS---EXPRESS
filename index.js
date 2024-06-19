import express from 'express'
import {PORT} from './config.js'
import { UsrRepository } from './user.repository.js'
const app = express()
app.use(express.json())

app.get('/', (req, resp)=>{
    resp.send('Hello World')
})

app.post('/register', (req, resp)=>{
    const {username, password} = req.body
    console.log(req.body)

    try {
        const id = UsrRepository.create({username, password})
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