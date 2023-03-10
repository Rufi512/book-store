import express from 'express'
import books from './routes/books'
import morgan from 'morgan'
import cors from 'cors';
const app = express()

//Settings
app.set('PORT',3000 || process.env.PORT)

//middlewares
app.use(express.json()) //req.body to json
app.use(morgan('dev'))
app.use(cors())

//Routes
app.use('/api/books',books)

app.listen(app.get('PORT'),()=>{
	console.log(`Server listener on port ${app.get('PORT')}`)
})