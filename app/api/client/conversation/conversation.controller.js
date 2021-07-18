import express from 'express';
import { CheckAuth } from '../../middlewares/auth.mid';
import CommonError from '../../library/error';
import { success } from '../../../utils/response-utils';
import ConversationService from './conversation.service';
import { fakeData } from './fakeData'

const api = express.Router();

api.post('/conversation/list/admin', CheckAuth, async (req, res) => {
  const list = await ConversationService.getListConversation();

  return res.json(success({list, numNewMess: 0}))
});

api.post('/conversation', CheckAuth, async (req, res) => {
  console.log('19', req.body)
});

api.post('/conversation/update', CheckAuth, async (req, res) => {
  console.log('23', req.body)

});

api.post('/conversation/getDisableNoti', CheckAuth, async (req, res) => {
  console.log('28', req.body)
});


module.exports = api;

