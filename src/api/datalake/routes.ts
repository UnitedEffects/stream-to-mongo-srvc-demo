import express from 'express';
import api from './api.js';
const router = express.Router();

router.get('/data', api.get);
router.get('/data/:id',  api.getOne);
router.post('/data', api.write);
router.patch('/data/:id', api.patch);

export default router;
