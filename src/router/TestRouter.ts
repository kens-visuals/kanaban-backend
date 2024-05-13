import express, { Router } from 'express';

const testRouter: Router = express.Router();

testRouter.get('/test', (req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

export default testRouter;
