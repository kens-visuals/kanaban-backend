import { Request, Response } from 'express';

import { Column } from '../model/ColumnModel';

import { getRandomColorHex } from '../helper_functions/generateRandomColor';

// TESTED ✅
export const findColumns = async (req: Request, res: Response) => {
  try {
    const columns = await Column.find();

    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const findColumnsByParentId = async (req: Request, res: Response) => {
  try {
    const { parent_board_id } = req.params as { parent_board_id: string };

    const columns = await Column.find({ parent_board_id });

    console.log(typeof parent_board_id);

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
    const { column_name, color, parent_board_id } = req.body as {
      column_name: string;
      color?: string;
      parent_board_id: string;
    };

    const newColumn = new Column({
      parent_board_id,
      name: column_name,
      color: color || getRandomColorHex(),
    });

    await newColumn.save();

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const editColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const updatedColumn = await Column.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    ).exec();

    if (!updatedColumn) {
      res
        .status(404)
        .json({ message: 'Column not found, please check column ID' });
    }

    res
      .status(200)
      .json({ message: 'Column updated successfully', updatedColumn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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
