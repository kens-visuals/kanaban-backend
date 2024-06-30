import { Request, Response } from 'express';

import { Column } from '../model/ColumnModel';

import { getRandomColorHex } from '../helper_functions/generateRandomColor';

// TESTED ✅
export const findColumnsByParentId = async (req: Request, res: Response) => {
  try {
    const { user_id, parent_board_id } = req.params as {
      user_id: string;
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

export const getColumnNamesByParentId = async (req: Request, res: Response) => {
  try {
    const { user_id, parent_board_id } = req.params as {
      user_id: string;
      parent_board_id: string;
    };

    const columns = await Column.find({ user_id, parent_board_id }).select(
      'column_name'
    );

    if (!columns) {
      res.status(404).json({ message: 'No columns found' });
    }

    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const editColumns = async (
  columns: {
    id: string;
    color?: string;
    column_name: string;
    parent_board_id: string;
  }[],
  parent_board_id: string,
  user_id: string
) => {
  try {
    const existingColumns = await Column.find({
      user_id,
      parent_board_id,
    }).exec();

    const bulkOps = [];
    const result: {
      updated: {
        id: string;
        column_name: string;
        color: string;
      }[];
      deleted: { id: string }[];
      inserted: {
        id: string;
        column_name: string;
        color: string;
      }[];
    } = {
      updated: [],
      deleted: [],
      inserted: [],
    };

    for (const existingColumn of existingColumns) {
      const updatedColumn = columns.find(
        (column) => column.id === existingColumn._id.toString()
      );

      if (updatedColumn) {
        bulkOps.push({
          updateOne: {
            filter: { _id: existingColumn._id },
            update: {
              column_name: updatedColumn.column_name?.trim(),
              color: updatedColumn.color || getRandomColorHex(),
            },
          },
        });
        result.updated.push({
          id: existingColumn._id.toString(),
          column_name: updatedColumn.column_name?.trim(),
          color: updatedColumn.color,
        });
      } else {
        bulkOps.push({
          deleteOne: {
            filter: { _id: existingColumn._id },
          },
        });
        result.deleted.push({ id: existingColumn._id.toString() });
      }
    }

    const newColumns = columns.filter(
      (column) => !existingColumns.some((c) => c._id.toString() === column.id)
    );

    for (const newColumnData of newColumns) {
      const newColumn = new Column({
        user_id,
        parent_board_id,
        column_name: newColumnData.column_name?.trim(),
        color: newColumnData.color || getRandomColorHex(),
      });

      bulkOps.push({ insertOne: { document: newColumn } });

      result.inserted.push({
        color: newColumnData.color,
        id: newColumn._id.toString(),
        column_name: newColumnData.column_name?.trim(),
      });
    }

    if (bulkOps.length > 0) {
      await Column.bulkWrite(bulkOps);
    }

    return result;
  } catch (error) {
    console.error('Error editing columns:', error);
    throw error;
  }
};

// TESTED ✅
export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id, user_id } = req.params as { id: string; user_id: string };

    const deletedColumn = await Column.findOneAndDelete({
      id: id,
      user_id,
    }).exec();

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
