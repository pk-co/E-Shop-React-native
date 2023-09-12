const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const productRouter = require('./routers/products')
const cors = require('cors')
require('dotenv/config')
const authJwt = require('./helpers/jwt')


//cors
app.use(cors())
app.options('*', cors())

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt); // secure


//Routes
const categoriesRoutes = require('./routers/categories')
const ordersRoutes = require('./routers/orders')
const productsRoutes = require('./routers/products')
const usersRouters = require('./routers/users')

const api = process.env.API_URL
// http://localhost:3000/api1/v1/products

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/orders`, ordersRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRouters)

//connect to db
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('connect to db.....')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(3000, () => {
  //console.log(api)
  console.log('server is running http://localhost:3000')
})
