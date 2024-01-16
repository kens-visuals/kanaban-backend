import mongoose, { Schema } from 'mongoose';

export type ColumnSchemaType = {
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  parent_board_id: Schema.Types.ObjectId;
};

const ColumnSchema = new mongoose.Schema<ColumnSchemaType>(
  {
    color: String,
    name: { type: String, required: true },
    parent_board_id: {
      ref: 'Board',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Column = mongoose.model('Column', ColumnSchema);
