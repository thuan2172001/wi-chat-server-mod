import { getNextSequence } from '../api/library/getNextCounter';
const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    content: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
      default: 'text',
    },
    sendAt: {
      type: Date,
      require: true,
    },
  },
  { timestamps: true },
);

MessageSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('messages');
    this.code = nextSeq;
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
