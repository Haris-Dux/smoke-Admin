import express from 'express';
import { getAllSupport , createSupport} from '../controller/ContactController.js';

const contactRouter = express.Router();

contactRouter.post("/createSupport",createSupport);
contactRouter.post("/getAllSupport",getAllSupport);

export default contactRouter;



