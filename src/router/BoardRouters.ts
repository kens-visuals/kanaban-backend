import express, { Router } from 'express';

import {
  editBoard,
  findBoards,
  deleteBoard,
  findBoardById,
  createNewBoard,
} from '../controller/BoardControllers';

const boardRouter: Router = express.Router();

boardRouter.get('/board', findBoards);
boardRouter.put('/board/:id', editBoard);
boardRouter.post('/board', createNewBoard);
boardRouter.get('/board/:id', findBoardById);
boardRouter.delete('/board/:id', deleteBoard);

export default boardRouter;
