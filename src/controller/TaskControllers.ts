import { Schema } from 'mongoose';
import { Request, Response } from 'express';

import { Subtask } from '../model/SubTask';
import { Task, TaskSchemaType } from '../model/TaskModel';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    let subtaskIds: Schema.Types.ObjectId[] = [];
    const { title, description, currentStatus, subtasks, parentColumnId } =
      req.body;

    if (!title || !description || !currentStatus) {
      return res.status(400).json({
        message:
          'Please provide a title, description, and current status for the task.',
      });
    }

    const newTaskData: TaskSchemaType = {
      title,
      description,
      currentStatus,
      parentColumnId,
      subtasks: subtaskIds,
    };

    const newTask = new Task(newTaskData);
    await newTask.save();

    if (subtasks && subtasks.length > 0) {
      const createdSubtasks = await Promise.all(
        subtasks.map(async (subtaskTitle: string) => {
          const subtask = new Subtask({
            title: subtaskTitle,
            completed: false,
            parentTaskId: newTask._id,
          });
          await subtask.save();
          return subtask._id;
        })
      );
      subtaskIds = createdSubtasks.map((subtask) => subtask._id);

      newTask.subtasks = subtaskIds;
      await newTask.save();
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
