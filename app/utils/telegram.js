const { axios } = require('axios');
const { botToken } = require('../environment');
const TELEGRAM_URL = `https://api.telegram.org/bot${botToken}/`;

const sendMessage = async ({ chat_id, text }) => {
  return axios({
    method: 'post',
    url: `${TELEGRAM_URL}/sendMessage`,
    data: {
      chat_id,
      text,
    },
  });
};

const sendPhoto = async ({ chat_id, photo }) => {
  const formdata = new FormData();
  formdata.append('chart_id', chat_id);
  formdata.append('photo', fs.createReadStream(photo));

  return axios({
    method: 'post',
    url: `${TELEGRAM_URL}/sendPhoto`,
    headers: { 'Content-Type': 'multipart/form-data' },
    body: formdata,
  });
};

module.exports = {
  sendMessage,
  sendPhoto,
};
