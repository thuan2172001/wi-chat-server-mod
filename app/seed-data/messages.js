import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Message from '../models/message';
import Conversation from '../models/conversation';
import User from '../models/user';

const Promise = require('bluebird');

export const generateMessage = async () => {
  try {
    const DataSchema = Message;
    const generateNumber = await DataSchema.countDocuments();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('messages');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      const conversation = await Conversation.findOne({
        code: fields[header.indexOf('conversation')],
      })

      const sender = await User.findOne({
        code: fields[header.indexOf('sender')],
      })

      if (!checkDataExits) {
        const _data = {
          code: fields[header.indexOf('code')],
          conversation,
          sender,
          content: fields[header.indexOf('content')],
          type: fields[header.indexOf('type')],
          sendAt: fields[header.indexOf('sendAt')]
        };
        const data = new DataSchema(_data);

        await data.save();
      }
    });

    console.log('Seed Message Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
