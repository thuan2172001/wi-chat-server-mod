const Conversation = require('../../../models/conversation');
const User = require('../../../models/user');
const Message = require('../../../models/message');

const getListConversation = async (req, res) => {
  const conversationList = await Conversation.find({})
  const list = await conversationList.map(async (conversation) => {
    const messageList = await Message.find({
      conversation: conversation._id,
    })

    return Promise.all(messageList.map(async (message) => {
      const user = await User.findOne({
        _id: message.sender,
      })

      // if (!user) return null;

      if (!user) {
        console.log(message)
        console.log(user)
      }

      const newMessage = {
        id: message.code,
        idSender: message.sender,
        idConversation: conversation.code,
        content: message.content,
        sendAt: message.sendAt,
        type: message.type,
        user: user,
      }

      return newMessage;
    })).then((data) => {
      return {
        id: conversation.code,
        name: conversation.name,
        Messages: data,
      }
    })
  })

  return Promise.all(list);
  // return axios({
  //   method: 'post',
  //   url: `https://chat.i2g.cloud/api/conversation/list/admin`,
  //   data: {
  //     ...req.body,
  //   },
  // }).then(data => {
  //   return res.json(success(data))
  // }).catch(err => {
  //   return res.json(serverError(err.message));
  // });
}

module.exports = {
  getListConversation,
};
