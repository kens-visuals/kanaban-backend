import { Request, Response } from 'express';

import { Board } from '../model/BoardModel';
import { Column } from '../model/ColumnModel';

export const findBoards = async (req: Request, res: Response) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const findBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await Board.findById(id);

    if (!board) {
      res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json(board);
  } catch (error) {}
};

export const postBoard = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name: string };

    const newBoard = new Board({ name });

    await newBoard.save();

    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { board_name } = req.body as { board_name: string };

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name: board_name },
      { new: true }
    ).exec();

    if (!updatedBoard) {
      res
        .status(404)
        .json({ message: 'Board not found, please check board ID' });
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
