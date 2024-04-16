import { Request, Response } from 'express';

import { Column } from '../model/ColumnModel';

import { getRandomColorHex } from '../helper_functions/generateRandomColor';

// TESTED ✅
export const findColumnsByParentId = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body as { user_id: string };
    const { parent_board_id } = req.params as {
      parent_board_id: string;
    };

    const columns = await Column.find({ user_id, parent_board_id });

    if (!columns) {
      res.status(404).json({ message: 'No columns found' });
    }

    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const postColumn = async (req: Request, res: Response) => {
  try {
    const { user_id, column_name, color, parent_board_id } = req.body as {
      color?: string;
      user_id: string;
      column_name: string;
      parent_board_id: string;
    };

    const newColumn = new Column({
      user_id,
      name: column_name,
      color: color || getRandomColorHex(),
      parent_board_id: parent_board_id.toString(),
    });

    await newColumn.save();

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const editColumns = async (
  columns: {
    _id?: string;
    color?: string;
    user_id: string;
    column_name: string;
    parent_board_id: string;
  }[],
  parent_board_id: string,
  user_id: string
) => {
  const existingColumns = await Column.find({
    user_id,
    parent_board_id,
  }).exec();

  for (const existingColumn of existingColumns) {
    const updatedColumn = columns.find(
      (column) => column._id === existingColumn._id.toString()
    );

    if (updatedColumn) {
      existingColumn.name = updatedColumn.column_name;
      existingColumn.color = updatedColumn.color || getRandomColorHex();
      await existingColumn.save();
    }
  }

  const newColumns = columns.filter(
    (column) => !existingColumns.some((c) => c._id.toString() === column._id)
  );

  for (const newColumnData of newColumns) {
    const newColumn = new Column({
      parent_board_id,
      user_id: newColumnData.user_id,
      name: newColumnData.column_name,
      color: newColumnData.color || getRandomColorHex(),
    });

    await newColumn.save();
  }
};

// TESTED ✅
export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { user_id } = req.body as { user_id: string };

    const deletedColumn = await Column.findByIdAndDelete(id).exec();

    if (!deletedColumn) {
      res
        .status(404)
        .json({ message: 'Column not found, please check column ID' });
    }

    res
      .status(200)
      .json({ message: 'Column deleted successfully', deletedColumn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
