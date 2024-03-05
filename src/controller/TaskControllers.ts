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
    const { title, description, current_status, subtasks, parent_column_id } =
      req.body;

    if (!title || !current_status) {
      return res.status(400).json({
        message: 'Please provide a title and current status for the task.',
      });
    }

    const newTaskData: TaskSchemaType = {
      title,
      description,
      current_status,
      parent_column_id,
      subtasks: subtaskIds,
    };

    const newTask = new Task(newTaskData);
    await newTask.save();

    if (subtasks && subtasks.length > 0) {
      const createdSubtasks = await Promise.all(
        subtasks.map(async (subtaskTitle: string) => {
          const subtask = new Subtask({
            completed: false,
            title: subtaskTitle,
            parent_task_id: newTask._id,
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

export const findAllTasksWithSameColumnId = async (
  req: Request,
  res: Response
) => {
  try {
    const { parent_column_id } = req.params;
    const tasks = await Task.find({ parent_column_id });

    if (!tasks) {
      res.status(404).json({ message: 'No tasks found' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;
    const { title, description, current_status, subtasks } = req.body;

    const task = await Task.findById(task_id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) {
      task.title = title;
    }

    if (description) {
      task.description = description;
    }

    if (current_status) {
      task.current_status = current_status;
    }

    if (subtasks && subtasks.length > 0) {
      const editedSubtasks = await Promise.all(
        subtasks.map(async (subtaskTitle: string) => {
          const subtask = new Subtask({
            completed: false,
            title: subtaskTitle,
            parent_task_id: task._id,
          });
          await subtask.save();
          return subtask._id;
        })
      );

      task.subtasks = editedSubtasks.map((subtask) => subtask._id);
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(task_id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
