import express, { Router } from 'express';

import {
  getTasks,
  createTask,
  deleteTask,
  findAllTasksWithSameColumnId,
} from '../controller/TaskControllers';

const taskRouter: Router = express.Router();

taskRouter.get('/task', getTasks);
taskRouter.post('/task', createTask);
taskRouter.delete('/task/:task_id', deleteTask);
taskRouter.get('/task/:parent_column_id', findAllTasksWithSameColumnId);

export default taskRouter;
