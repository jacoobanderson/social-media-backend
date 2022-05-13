import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  messages: {
    type: [Object]
  },
  room: {
    type: String
  }
})

export const Messages = mongoose.model('Messages', schema)
