import { getNextSequence } from '../api/library/getNextCounter';
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      require: true
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    }]
  },
  { timestamps: true },
);

ConversationSchema.pre('validate', async function () {
  if (!this.code) {
    const nextSeq = await getNextSequence('conversations');
    this.code = nextSeq;
  }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
