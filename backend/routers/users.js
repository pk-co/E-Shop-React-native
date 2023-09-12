const { User } = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// View the userList
router.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash')
  //const userList = await User.find().select('name email phone')

  if (!userList) {
    res.status(500).json({ success: false })
  }

  res.send(userList)
})

//Get Single user by id
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    res.status(500).json({ message: 'The user with given id not found' })
  }

  res.status(200).send(user)
})

// Register the user
router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })
  user = await user.save()

  if (!user) {
    res.status(404).send('The user cannot be create')
  }
  res.send(user)
})



// Send to ther server email and password (login)
  router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.SECRET;
    if(!user){
      return res.status(400).send('user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
      const token = jwt.sign(
        {
        userId: user.id
        },
        secret,
        {expiresIn: '1d'}
      )

      res.status(200).send({user: user.email, token : token});
    } else {
      res.status(400).send('wrong password');
    }

    
  })



// router.post('/login', async (req, res) => {
//   const user = await User.findOne({ email: req.body.email }) // check the email is correct
//   //const pass = await bcrypt.compareSync(req.body.password, user.passwordHash) // compare the password and hashpassword
//   const secret = process.env.secret;

//   if (!user) {
//     return res.status(400).send('The user with this email not found')
//   }

//   if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
//       const token = jwt.sign(
//         {
//           userId: user.id,
//         },
//         secret,
//         {expiresIn: '1d'}
//       )
//       res.status(200).send({ user: user.email, token: token })
//   } else {
//     res.status(400).send('Password is wrong')
//   }

// })



// router.post('/login', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email })

//     if (!user) {
//       return res.status(400).send('The user with this email not found')
//     }

//     const pass = await bcrypt.compare(req.body.password, user.passwordHash)
//     const secret = await process.env.secret
//     if (pass) {
//       const token = jwt.sign(
//         {
//           userId: user.id,
//         },
//         secret,
//         {
//           expiresIn: '1d',
//         },
//       )

//       res.status(200).send({ user: user.email, token: token })
//     } else {
//       res.status(400).send('Password is wrong')
//     }
//   } catch (error) {
//     console.error('An error occurred:', error)
//     res.status(500).send('An error occurred during login')
//   }
// })

module.exports = router
