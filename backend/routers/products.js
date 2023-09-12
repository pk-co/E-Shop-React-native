const { Category } = require('../models/category')
const { Product } = require('../models/product')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

//View the product list from db
// router.get('/', async (req, res) => {
//   const productList = await Product.find().select('name image ')
//   //  const productList = await Product.find().select('name image -_id')
//   if (!productList) {
//     res.status(500).json({ success: false })
//   }
//   res.send(productList)
// })

// filtering and getting products by category
router.get('/', async (req, res) => {
  //localhost:3000/api/v1/products?categories=1234,4321
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }

  const productList = await Product.find(filter).populate('category')
  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.send(productList)
})

//View the products by id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category')

  if (!product) {
    res.status(500).json({ message: 'The product with given id not found' })
  }
  res.status(200).send(product)
})

// post to the data for db
router.post('/', async (req, res) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid Category')

  const product = await new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })
  try {
    product.save()

    if (!product) {
      return res.status(500).send('The product cannot be created.')
    }
    res.send(product)
  } catch (err) {
    res.send(err)
  }
})

// Update the product
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product ID')
  }

  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid Category')

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true },
  )
  if (!product) {
    return res.status(500).send('Product not update')
  }
  res.send(product)
})

// Delete the product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id)

    if (product) {
      return res
        .status(200)
        .json({ success: true, message: 'the product was deleted' })
    } else {
      return res.status(404).json({ message: 'Product was not found' })
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message })
  }
})

// Return How many products have the data base(Number)
router.get('/get/count', async (req, res) => {
  const productCount = await Product.countDocuments()

  if (!productCount) {
    res.status(500).json({ success: false })
  }
  res.send({
    productCount: productCount,
  })
})

// Using Try Catch

// router.get('/get/count', async (req, res) => {
//   try {
//     const productCount = await Product.countDocuments();

//     if (!productCount) {
//       return res.status(500).json({ success: false });
//     }

//     res.json({
//       productCount: productCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

// get fetured product
router.get('/get/featured/:count', async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({ isFeatured: true }).limit(+count)

  if (!products) {
    res.status(500).json({ success: false })
  }
  res.send(products)
})

module.exports = router
