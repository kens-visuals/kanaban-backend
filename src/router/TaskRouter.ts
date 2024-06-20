import express, { Router } from 'express';

import {
  editTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasksByParentBoardId,
} from '../controller/TaskControllers';

const taskRouter: Router = express.Router();

taskRouter.post('/task/:user_id', createTask);
taskRouter.put('/task/:user_id/:task_id', editTask);
taskRouter.delete('/task/:user_id/:task_id', deleteTask);
taskRouter.get('/task/:user_id/:parent_column_id/:task_id', getTaskById);
taskRouter.get('/task/:user_id/:parent_board_id', getTasksByParentBoardId);

export default taskRouter;
