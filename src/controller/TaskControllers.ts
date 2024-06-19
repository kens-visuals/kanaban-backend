import { Types } from 'mongoose';
import { Request, Response } from 'express';

import { Subtask } from '../model/SubTask';
import { Task, TaskSchemaType } from '../model/TaskModel';

// TESTED ✅
export const getTasksByParentColumnId = async (req: Request, res: Response) => {
  try {
    const { user_id, parent_column_id } = req.params as {
      user_id: string;
      parent_column_id: string;
    };

    const tasks = await Task.find({ user_id, parent_column_id }).populate(
      'subtasks'
    );

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { task_id, user_id, parent_column_id } = req.params as {
      task_id: string;
      user_id: string;
      parent_column_id: string;
    };

    const task = await Task.findOne({
      user_id,
      _id: task_id,
      parent_column_id,
    }).populate('subtasks');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
export const createTask = async (req: Request, res: Response) => {
  const { user_id } = req.params as { user_id: string };
  const { title, subtasks, description, current_status, parent_column_id } =
    req.body as TaskSchemaType;

  try {
    if (!title || !current_status) {
      return res.status(400).json({
        message: 'Please provide a title and current status for the task.',
      });
    }

    const newTaskData: TaskSchemaType = {
      title,
      user_id,
      description,
      subtasks: [],
      current_status,
      parent_column_id,
    };

    const newTask = new Task(newTaskData);
    await newTask.save();

    if (subtasks && subtasks.length > 0) {
      const createdSubtasks = await Promise.all(
        subtasks.map(async (subtaskTitle: Types.ObjectId) => {
          const subtask = new Subtask({
            completed: false,
            title: subtaskTitle,
            parent_task_id: newTask._id,
          });
          await subtask.save();
          return subtask._id;
        })
      );

      newTask.subtasks = createdSubtasks;
      await newTask.save();
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// TESTED ✅
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

// TESTED
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { task_id, user_id } = req.params as {
      task_id: string;
      user_id: string;
    };
    const deletedTask = await Task.findOneAndDelete({ user_id, _id: task_id });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
