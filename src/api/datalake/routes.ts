import express from 'express';
import api from './api.js';
//import m from '../../middleware.js';
const router = express.Router();

router.get('/dl', api.get);
router.get('/dl/:id',  api.getOne);
router.post('/dl', api.write);
router.patch('/dl/:id', api.patch);

export default router;
