import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  replies: {
    type: [Object]
  },
  title: {
    type: String
  },
  owner: {
    type: String
  },
  content: {
    type: String
  },
  likes: {
    type: Number
  },
  dislikes: {
    type: Number
  }
})

export const Discussion = mongoose.model('Discussion', schema)
