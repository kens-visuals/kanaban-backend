import mongoose, { Schema } from 'mongoose';

export type TaskSchemaType = {
  title: string;
  description?: string;
  current_status: string;
  subtasks?: Schema.Types.ObjectId[];
  parent_column_id: Schema.Types.ObjectId;
};

const TaskSchema = new mongoose.Schema<TaskSchemaType>(
  {
    description: String,
    title: { type: String, required: true },
    current_status: { type: String, required: true },
    subtasks: [{ ref: 'Subtask', type: Schema.Types.ObjectId }],
    parent_column_id: {
      ref: 'Column',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', TaskSchema);
