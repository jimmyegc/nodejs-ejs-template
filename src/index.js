import { config } from 'dotenv'
config();

import express from 'express'
import mongoose from 'mongoose'
import methodOverride from 'method-override'

import session from 'express-session'

import userRoutes from './routes/users.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000;

// database
mongoose.connect(process.env.DB_URI)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("💾 Connected to the database"))

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(session({
  secret: "deftones",
  saveUninitialied: true,
  resave: false
}))

app.use((req,res, next) => {
  res.locals.message = req.session.message
  delete req.session.message 
  next()
})

// Motor de plantillas
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Rutas
app.use('/uploads', express.static('uploads'))
app.use("/users", userRoutes)

/* app.get('/', (req, res) => {
  res.render('index', { title: "Mi titulo" })
})

app.get('/hello', (req, res) => {
  res.send({ message: "Hello" })
})
 */
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`)
})
