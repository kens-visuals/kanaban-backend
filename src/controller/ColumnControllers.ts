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
      'name'
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
// export const postColumn = async (req: Request, res: Response) => {
//   try {
//     const { user_id } = req.params as { user_id: string };
//     const { column_name, color, parent_board_id } = req.body as {
//       color?: string;
//       column_name: string;
//       parent_board_id: string;
//     };

//     const newColumn = new Column({
//       user_id,
//       name: column_name,
//       color: color || getRandomColorHex(),
//       parent_board_id: parent_board_id.toString(),
//     });

//     await newColumn.save();

//     res.status(201).json(newColumn);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// TESTED ✅
export const editColumns = async (
  columns: {
    id?: string;
    color?: string;
    user_id: string;
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

    for (const existingColumn of existingColumns) {
      const updatedColumn = columns.find(
        (column) => column.id === existingColumn._id.toString()
      );

      if (updatedColumn) {
        existingColumn.column_name = updatedColumn.column_name;
        existingColumn.color = updatedColumn.color || getRandomColorHex();
        await existingColumn.save();
      } else {
        await existingColumn.deleteOne();
      }
    }

    const newColumns = columns.filter(
      (column) => !existingColumns.some((c) => c._id.toString() === column.id)
    );

    for (const newColumnData of newColumns) {
      const newColumn = new Column({
        user_id,
        parent_board_id,
        column_name: newColumnData.column_name,
        color: newColumnData.color || getRandomColorHex(),
      });

      await newColumn.save();
    }
  } catch (error) {
    console.error('Error editing columns:', error);
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
