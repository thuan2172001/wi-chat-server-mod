import faker from 'faker';
import User from '../models/user';
import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Role from '../models/role';

const Promise = require('bluebird');

faker.locale = 'vi';

export const createDefaultUser = async () => {
  try {
    const generateNumber = await User.countDocuments();

    if (generateNumber > 0) return;

    const userFile = await getCSVFiles('users');

    const { header, content } = await getContentCSVFiles(userFile[0]);

    await Promise.each(content, async (line) => {
      const field = cleanField(line.split(','));

      const roleCode = field[header.indexOf('role')];
      const role = await Role.findOne({ code: roleCode });
      const checkDataExits = await User.findOne({
        code: field[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const user = new User({
          _id: field[header.indexOf('_id')],
          code:field[header.indexOf('code')],
          username: field[header.indexOf('username')],
          password: field[header.indexOf('password')],
          color: field[header.indexOf('color')],
          role,
        });

        await user.save();

      }
    });

    console.log('Seed User Success');
  } catch (err) {
    throw new Error(err.message);
  }
};
