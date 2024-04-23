import mongoose, { Schema, Types } from 'mongoose';

export type TaskSchemaType = {
  title: string;
  user_id: string;
  description?: string;
  current_status: string;
  subtasks?: Types.ObjectId[];
  parent_column_id: Types.ObjectId;
};

const TaskSchema = new mongoose.Schema<TaskSchemaType>(
  {
    description: String,
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    current_status: { type: String, required: true },
    subtasks: [{ ref: 'Subtask', type: Types.ObjectId }],
    parent_column_id: {
      ref: 'Column',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', TaskSchema);
