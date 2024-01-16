import express, { Router } from 'express';

import {
  postBoard,
  editBoard,
  findBoards,
  deleteBoard,
  findBoardById,
} from '../controller/BoardControllers';

const boardRouter: Router = express.Router();

boardRouter.get('/board', findBoards);
boardRouter.get('/board/:id', findBoardById);
boardRouter.post('/board', postBoard);
boardRouter.put('/board/:id', editBoard);
boardRouter.delete('/board/:id', deleteBoard);

export default boardRouter;
