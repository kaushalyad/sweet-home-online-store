import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  status: { type: String, enum: ['new', 'handled'], default: 'new' },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message
