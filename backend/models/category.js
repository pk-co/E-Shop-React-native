const mongoose = require('mongoose')

// create category schema
const categoryScchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  icon: {
    type: String,
  },
})

// create (virtual id) id filed without (_)

categoryScchema.virtual('id').get(function () {
  return this._id.toHexString()
})

categoryScchema.set('toJSON', {
  virtuals: true,
})

// exports category model
exports.Category = mongoose.model('Category', categoryScchema)
