import { Request, Response } from 'express';

import { Board } from '../model/BoardModel';
import { Column } from '../model/ColumnModel';

import { updateColumns } from '../helper_functions/updateColumns';
import { getRandomColorHex } from '../helper_functions/generateRandomColor';

export type Column = {
  color?: string;
  column_name: string;
  parent_board_id: string;
};

export type EditBoardRequest = {
  board_name: string;
  columns?: Exclude<Column, 'parent_board_id'>[];
};

// TESTED ✅
export const findBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const findBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id);
    const columns = await Column.find({ parent_board_id: id });

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json({ board, columns });
  } catch (error) {}
};

// TESTED ✅
export const createNewBoard = async (req: Request, res: Response) => {
  const { columns, board_name } = req.body as {
    board_name: string;
    columns?: {
      color?: string;
      column_name: string;
    }[];
  };

  try {
    const newBoard = new Board({ name: board_name });
    await newBoard.save();

    const parent_board_id = newBoard._id;

    if (columns && columns.length > 0) {
      const newColumns = columns?.map(async (column) => {
        const newColumn = new Column({
          name: column.column_name,
          color: column.color || getRandomColorHex(),
          parent_board_id: parent_board_id.toString(),
        });
        await newColumn.save();
        return newColumn;
      });

      await Promise.all(newColumns);
    }

    res.status(201).json({
      message: 'Board and column created successfully',
      newBoard,
      columns,
    });
  } catch (error) {
    console.error('Error creating board and column:', error);
    res.status(500).json({ message: 'Error creating board and column' });
  }
};

// TESTED ✅
export const editBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { columns, board_name } = req.body as {
      board_name: string;
      columns?: {
        _id?: string;
        color?: string;
        column_name: string;
        parent_board_id: string;
      }[];
    };

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name: board_name },
      { new: true }
    ).exec();

    if (!updatedBoard) {
      return res
        .status(404)
        .json({ message: 'Board not found, please check board ID' });
    }

    if (columns && columns.length > 0) {
      await updateColumns(columns, id);
    }

    res
      .status(200)
      .json({ message: 'Board updated successfully', updatedBoard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBoard = await Board.findByIdAndDelete(id).exec();

    const deletedColumns = await Column.deleteMany({
      parent_board_id: id,
    }).exec();

    if (deletedBoard || deletedColumns) {
      res.status(200).json({
        deletedBoard,
        deletedColumns,
        message: 'Board deleted successfully',
      });
    } else {
      res.status(404).json({ message: 'Board not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
