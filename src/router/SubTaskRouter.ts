import express, { Router } from 'express';
import { markSubtask } from '../controller/SubTaskControllers';

const subTaskRouter: Router = express.Router();

subTaskRouter.post('/subtasks/mark-subtask', markSubtask);

export default subTaskRouter;
