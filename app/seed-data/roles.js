import { getCSVFiles, getContentCSVFiles, cleanField } from './scanDataFile';
import Role from '../models/role';

const Promise = require('bluebird');

export const generateRole = async () => {
  try {
    const DataSchema = Role;
    const generateNumber = await DataSchema.countDocuments();

    if (generateNumber > 0) return;
    const fileData = await getCSVFiles('roles');

    const { header, content } = await getContentCSVFiles(fileData[0]);

    await Promise.each(content, async (line) => {
      const fields = cleanField(line.split(','));
      const checkDataExits = await DataSchema.findOne({
        code: fields[header.indexOf('code')],
      });

      if (!checkDataExits) {
        const _data = {
          role: fields[header.indexOf('role')],
          code: fields[header.indexOf('code')],
        };
        const data = new DataSchema(_data);

        await data.save();
      }
    });

    console.log('Seed Role Success');
  } catch
  (err) {
    throw new Error(err.message);
  }
};
