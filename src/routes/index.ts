import express from "express";
import Root from './root.js';
import Data from '../api/datalake/routes.js';
const router = express.Router();

// Add all routes here...
router.use(Root);
router.use('/api', Data);

export default router;
