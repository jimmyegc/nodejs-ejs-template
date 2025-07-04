import { mongoose } from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true 
  },
  image: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  }
})

export default mongoose.model("User", userSchema)