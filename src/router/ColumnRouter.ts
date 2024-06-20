import express, { Router } from 'express';

import {
  // postColumn,
  deleteColumn,
  findColumnsByParentId,
  getColumnNamesByParentId,
} from '../controller/ColumnControllers';

const columnRouter: Router = express.Router();

columnRouter.delete('/column/:user_id/:id', deleteColumn);
// columnRouter.post('/column/:user_id/:parent_board_id', postColumn);
columnRouter.get('/column/:user_id/:parent_board_id', findColumnsByParentId);
columnRouter.get(
  '/column-names/:user_id/:parent_board_id',
  getColumnNamesByParentId
);

export default columnRouter;
