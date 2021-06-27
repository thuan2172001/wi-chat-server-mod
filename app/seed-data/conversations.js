import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Conversation from '../models/conversation';
import User from '../models/user';

const Promise = require('bluebird');

export const generateConversation = async () => {
  try {
    const DataSchema = Conversation;
    const generateNumber = await DataSchema.countDocuments();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('conversations');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      const codeUserList = fields[header.indexOf('user')].split('-');
      const userList = await codeUserList.map((userCode) => {
        return User.findOne({
          code: userCode,
        })
      })

      if (!checkDataExits) {
        const _data = {
          code: fields[header.indexOf('code')],
          name: fields[header.indexOf('name')],
          user: userList,
        };
        const data = new DataSchema(_data);

        await data.save();
      }
    });

    console.log('Seed Conversation Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
