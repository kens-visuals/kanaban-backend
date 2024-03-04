import { Column } from '../model/ColumnModel';
import { getRandomColorHex } from './generateRandomColor';

export const updateColumns = async (
  columns: {
    _id?: string;
    color?: string;
    column_name: string;
    parent_board_id: string;
  }[],
  parent_board_id: string
) => {
  const existingColumns = await Column.find({ parent_board_id }).exec();

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
      name: newColumnData.column_name,
      color: newColumnData.color || getRandomColorHex(),
    });

    await newColumn.save();
  }
};
