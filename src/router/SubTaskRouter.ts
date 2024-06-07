import express, { Router } from 'express';
import { markSubtask } from '../controller/SubTaskControllers';

const subTaskRouter: Router = express.Router();

subTaskRouter.post('/subtasks/mark-subtask/:user_id', markSubtask);

export default subTaskRouter;
