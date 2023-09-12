const { Category } = require('../models/category')
const express = require('express')
const router = express.Router()

// View The all data
router.get('/', async (req, res) => {
  const categoryList = await Category.find()

  if (!categoryList) {
    res.status(500).json({ success: false })
  }
  res.status(200).send(categoryList)
})

// View data by id
router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res
      .status(500)
      .json({ message: 'the category with given id was not found' })
  }
  res.status(200).send(category)
})

// add to data to db
router.post('/', async (req, res) => {
  const category = await new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
  })

  category.save()

  if (!category) {
    return res.status(404).send('the category cannot be created!')
  }
  res.send(category)

  //Better way

  // try {
  //   category.save()

  //   if(!category){
  //     return res.status(404).send('the category cannot be created!')
  //   }
  //   res.send(category)
  // }catch (err) {
  //   console.log(err);
  //   res.status(500).send('Internal server error')
  // }
})

// Update the data of category
router.put('/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    },
    { new: true },
  )
  if (!category) {
    return res.status(400).send('category cannot update')
  }
  res.send(category)
})

// Delete the category using promises
router.delete('/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: 'the category  deleted..' })
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'category not found' })
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err })
    })
})

// using async await

// router.delete('/:id', async (req, res) => {
//   try {
//     const category = await Category.findByIdAndRemove(req.params.id);

//     if (category) {
//       return res.status(200).json({ success: true, message: 'The category was deleted.' });
//     } else {
//       return res.status(404).json({ success: false, message: 'Category not found.' });
//     }
//   } catch (error) {
//     return res.status(400).json({ success: false, error: error.message });
//   }
// });

module.exports = router
