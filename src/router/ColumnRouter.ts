import express, { Router } from 'express';

import {
  postColumn,
  editColumn,
  findColumns,
  deleteColumn,
  findColumnsByParentId,
} from '../controller/ColumnControllers';

const columnRouter: Router = express.Router();

columnRouter.get('/column', findColumns);
columnRouter.put('/column/:id', editColumn);
columnRouter.delete('/column/:id', deleteColumn);
columnRouter.post('/column/:parent_board_id', postColumn);
columnRouter.get('/column/:parent_board_id', findColumnsByParentId);

export default columnRouter;
