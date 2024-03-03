import mongoose, { Schema } from 'mongoose';

export type TaskSchemaType = {
  title: string;
  description: string;
  currentStatus: string;
  subtasks?: Schema.Types.ObjectId[];
  parentColumnId: Schema.Types.ObjectId;
};

const TaskSchema = new mongoose.Schema<TaskSchemaType>(
  {
    title: String,
    description: String,
    currentStatus: String,
    subtasks: [{ ref: 'Subtask', type: Schema.Types.ObjectId }],
    parentColumnId: {
      ref: 'Column',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', TaskSchema);
