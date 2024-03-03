import express, { Router } from 'express';

import { createTask, getTasks } from '../controller/TaskControllers';

const taskRouter: Router = express.Router();

taskRouter.get('/task', getTasks);
taskRouter.post('/task', createTask);

export default taskRouter;
