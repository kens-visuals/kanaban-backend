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

boardRouter.post('/board', createNewBoard);
boardRouter.get('/board/:user_id', findBoards);
boardRouter.put('/board/:user_id/:id', editBoard);
boardRouter.get('/board/:user_id/:id', findBoardById);
boardRouter.delete('/board/:user_id/:id', deleteBoard);
boardRouter.get('/board-names/:user_id', getBoardNames);

export default boardRouter;
