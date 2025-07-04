import 'dotenv/config'
import express from 'express'
import connectDB from './config/db.js'
import userRoutes from './routes/user.js'
import walletRoutes from './routes/wallet.js'
import billRoutes from './routes/bills.js'

connectDB()

const app = express()
const port = 3000

app.use(express.json({ limit: '200mb' }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRoutes)
app.use('/wallet', walletRoutes)
app.use('/bills', billRoutes)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
