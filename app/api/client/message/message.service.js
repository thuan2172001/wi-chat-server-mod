const Conversation = require('../../../models/conversation');
const User = require('../../../models/user');
const Message = require('../../../models/message');
const NewMessage = require('../../../models/new_message');

const { isValidString } = require('../../../utils/validate-utils');

const validateMessage = async (body) => {
  const { content, type, idConversation, user, sendAt } = body;

  const conversation = await Conversation.findOne({
    code: idConversation,
  }).lean();
  if (!conversation) throw new Error('400.MESSAGE.POST.Conversation_NOT_FOUND');

  const sender = await User.find({
    id: user._id,
  });
  if (!sender) await new Error('400.MESSAGE.POST.SENDER_NOT_FOUND');

  if (!isValidString(content))
    throw new Error('400.MESSAGE.POST.CONTENT_INVALID');

  if (!isValidString(type)) throw new Error('400.MESSAGE.POST.TYPE_INVALID');

  return { content, type, idConversation, user, sendAt };
};

const createMessage = async (body) => {

  const { content, type, idConversation, user, sendAt } =
    await validateMessage(body);

  const conversation = await Conversation.findOne({
    code: idConversation,
  })

  const senderUser = await User.findOne({
    username: user.username,
  })

  const message = new Message({
    content,
    type,
    conversation: conversation._id,
    sender: senderUser._id,
    sendAt,
  });

  return message.save();
};

const validateSeenMessage = async (body) => {
  const { conversationId, userId } = body;

  const conversation = await NewMessage.findOne({
    conversation: conversationId,
    user: userId,
  })
  if (!conversation) throw new Error('400.MESSAGE.POST.Conversation_NOT_FOUND');

  return { conversationId, userId };
};

const clearNewMessage = async (body) => {

  const { conversationId, userId } = await validateSeenMessage(body);

  return NewMessage.remove({ conversation: conversationId, user: userId });
};

const shouldSendTelegram = async ({ }) => { };

module.exports = {
  validateMessage,
  validateSeenMessage,
  createMessage,
  clearNewMessage,
};
