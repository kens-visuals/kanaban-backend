import express, { Router } from 'express';

import {
  postColumn,
  deleteColumn,
  findColumnsByParentId,
} from '../controller/ColumnControllers';

const columnRouter: Router = express.Router();

columnRouter.delete('/column/:id', deleteColumn);
columnRouter.post('/column/:parent_board_id', postColumn);
columnRouter.get('/column/:user_id/:parent_board_id', findColumnsByParentId);

export default columnRouter;
