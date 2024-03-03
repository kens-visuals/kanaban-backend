import { Schema, model } from 'mongoose';

type SubtaskSchemaType = {
  title: string;
  completed: boolean;
  parentTaskId: Schema.Types.ObjectId;
};

const SubtaskSchema = new Schema<SubtaskSchemaType>(
  {
    completed: Boolean,
    title: { type: String, required: true },
    parentTaskId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Subtask = model('Subtask', SubtaskSchema);
