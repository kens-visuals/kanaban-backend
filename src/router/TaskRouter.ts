import express, { Router } from 'express';

import {
  editTask,
  createTask,
  deleteTask,
  getTasksByParentColumnId,
} from '../controller/TaskControllers';

const taskRouter: Router = express.Router();

taskRouter.post('/task', createTask);
taskRouter.put('/task/:task_id', editTask);
taskRouter.delete('/task/:task_id', deleteTask);
taskRouter.get('/task/:parent_column_id', getTasksByParentColumnId);

export default taskRouter;
