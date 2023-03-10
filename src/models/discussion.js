import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  replies: {
    type: [Object]
  },
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  owner: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  }
}, {
  timestamps: true
})

export const Discussion = mongoose.model('Discussion', schema)
