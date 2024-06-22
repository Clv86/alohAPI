const express = require('express')
const app = express()
const PORT = 8080
const mongoose = require('mongoose')

require('dotenv').config()

const spotRoutes = require('./routes/spot')
const dayConditionsRoutes = require('./routes/dayConditions')
const weekConditionsRoutes = require('./routes/weekConditions')

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.URL)
        console.log('Connexion à MongoDB réussie !')
    } catch (error) {
        console.error('Connexion à MongoDB échouée !', error)
    }
}

connectToDatabase()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use('/spot', spotRoutes)
app.use('/dayConditions', dayConditionsRoutes)
app.use('/weekConditions', weekConditionsRoutes)

app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
)
