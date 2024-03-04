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
boardRouter.get('/board/:id', findBoardById);
boardRouter.delete('/board/:id', deleteBoard);
boardRouter.post('/create-new-board', createNewBoard);

export default boardRouter;
