import express from 'express';
import { CheckAuth, CheckAuthV2 } from '../../middlewares/auth.mid';
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

module.exports = api;

