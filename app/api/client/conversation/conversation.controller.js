import express from 'express';
import { CheckAuthV2 } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import ConversationService from './conversation.service';
import { fakeData } from './fakeData'

const api = express.Router();

api.post('/conversation/list/admin', async (req, res) => {
  const list = await ConversationService.getListConversation();

  // const list = fakeData

  return res.json(success({list, numNewMess: 0}))
});

api.post('/conversation', async (req, res) => {
  console.log('19', req.body)
});

api.post('/conversation/update', async (req, res) => {
  console.log('23', req.body)

});

api.post('/conversation/getDisableNoti', async (req, res) => {
  console.log('28', req.body)
});


module.exports = api;

