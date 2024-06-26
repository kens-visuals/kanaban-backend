import { Request, Response } from 'express';

import { Board } from '../model/BoardModel';
import { Column } from '../model/ColumnModel';

import { editColumns } from './ColumnControllers';
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
    const { user_id } = req.params as { user_id: string };
    const boards = await Board.find({ user_id });

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const getBoardNames = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params as { user_id: string };
    const boards = await Board.find({ user_id })
      .sort({ createdAt: -1 })
      .select('name');

    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const findBoardById = async (req: Request, res: Response) => {
  try {
    const { id, user_id } = req.params as { id: string; user_id: string };
    const board = await Board.findOne({ _id: id, user_id }).exec();

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json({ board });
  } catch (error) {}
};

// TESTED ✅
export const createNewBoard = async (req: Request, res: Response) => {
  const { user_id } = req.params as { user_id: string };
  const { columns, board_name } = req.body as {
    board_name: string;
    columns?: {
      color?: string;
      column_name: string;
    }[];
  };

  try {
    const newBoard = new Board({ name: board_name, user_id });
    await newBoard.save();

    const parent_board_id = newBoard.id;

    if (columns && columns.length > 0) {
      const newColumns = columns?.map(async (column) => {
        const newColumn = new Column({
          user_id,
          column_name: column.column_name,
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
      data: { newBoard, columns },
    });
  } catch (error) {
    console.error('Error creating board and column:', error);
    res.status(500).json({ message: 'Error creating board and column' });
  }
};

// TESTED ✅
export const editBoard = async (req: Request, res: Response) => {
  try {
    const { id, user_id } = req.params as { id: string; user_id: string };
    const { columns, board_name } = req.body as {
      board_name: string;
      columns?: {
        id: string;
        color?: string;
        user_id: string;
        column_name: string;
        parent_board_id: string;
      }[];
    };

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { user_id, name: board_name },
      { new: true }
    ).exec();

    if (!updatedBoard) {
      return res
        .status(404)
        .json({ message: 'Board not found, please check board ID' });
    }

    const editedColumns = await editColumns(columns, id, user_id);

    res.status(200).json({
      message: 'Board updated successfully',
      updatedBoard,
      editedColumns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id, user_id } = req.params as { id: string; user_id: string };

    const deletedBoard = await Board.findOneAndDelete({
      _id: id,
      user_id,
    }).exec();

    const deletedColumns = await Column.deleteMany({
      user_id,
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
