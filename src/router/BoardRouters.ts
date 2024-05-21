import express, { Router } from 'express';

import {
  editBoard,
  findBoards,
  deleteBoard,
  findBoardById,
  getBoardNames,
  createNewBoard,
} from '../controller/BoardControllers';

const boardRouter: Router = express.Router();

boardRouter.get('/board', findBoards);
boardRouter.put('/board/:id', editBoard);
boardRouter.post('/board', createNewBoard);
boardRouter.get('/board/:id', findBoardById);
boardRouter.delete('/board/:id', deleteBoard);
boardRouter.get('/board-names/:user_id', getBoardNames);

export default boardRouter;
