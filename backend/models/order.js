const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({})

// create (virtual id) id filed without (_)

orderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

orderSchema.set('toJSON', {
  virtuals: true,
})

exports.Order = mongoose.model('Order', orderSchema)
