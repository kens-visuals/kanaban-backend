import express, { Router } from 'express';
import {
  markSubtask,
  getSubtasksByParentTaskId,
} from '../controller/SubTaskControllers';

const subTaskRouter: Router = express.Router();

subTaskRouter.post('/subtasks/mark-subtask/:user_id', markSubtask);
subTaskRouter.get('/subtasks/:parent_task_id', getSubtasksByParentTaskId);

export default subTaskRouter;
