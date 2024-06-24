import mongoose, { Schema } from 'mongoose';

export type ColumnSchemaType = {
  color?: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  column_name: string;
  parent_board_id: Schema.Types.ObjectId;
};

const ColumnSchema = new mongoose.Schema<ColumnSchemaType>(
  {
    color: String,
    user_id: { type: String, required: true },
    column_name: { type: String, required: true, unique: true },
    parent_board_id: {
      ref: 'Board',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

ColumnSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Column = mongoose.model('Column', ColumnSchema);
