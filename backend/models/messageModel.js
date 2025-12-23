import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  productName: { type: String, required: false },
  type: { type: String, enum: ['general', 'product_notification', 'contact'], default: 'general' },
  status: { type: String, enum: ['new', 'handled', 'notified'], default: 'new' },
  notifiedAt: { type: Date },
}, { timestamps: true })

// Index for faster queries
messageSchema.index({ email: 1, productId: 1 })
messageSchema.index({ status: 1 })
messageSchema.index({ type: 1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
