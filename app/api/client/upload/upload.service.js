import { uploadFile } from '../../../utils/upload'

const upload = async ({ name, file }) => {
    if (!file) throw new Error('UPLOAD.EMPTY_FILE')
    const { pathFile } = await uploadFile({ name, file })
    return pathFile;
};

module.exports = {
    upload,
};
