import { Types } from 'mongoose';
import { Request, Response } from 'express';

import { Subtask } from '../model/SubTask';
import { Task, TaskSchemaType } from '../model/TaskModel';

// TESTED ✅
export const getTasksByParentBoardId = async (req: Request, res: Response) => {
  try {
    const { user_id, parent_board_id } = req.params as {
      user_id: string;
      parent_board_id: string;
    };

    const tasks = await Task.find({ user_id, parent_board_id }).populate(
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
    const { task_id, user_id, parent_board_id } = req.params as {
      task_id: string;
      user_id: string;
      parent_board_id: string;
    };

    const task = await Task.findOne({
      user_id,
      _id: task_id,
      parent_board_id,
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
  const { title, subtasks, description, current_status, parent_board_id } =
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
      parent_board_id,
      completed_subtasks: 0,
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
// export const editTask = async (req: Request, res: Response) => {
//   try {
//     const { task_id } = req.params;
//     const { title, description, current_status, subtasks } =
//       req.body as TaskSchemaType;

//     const task = await Task.findById(task_id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     if (title) {
//       task.title = title;
//     }

//     if (description) {
//       task.description = description;
//     }

//     if (current_status) {
//       task.current_status = current_status;
//     }

//     if (subtasks && subtasks.length > 0) {
//       const editedSubtasks = await Promise.all(
//         subtasks.map(async (subtaskTitle: Types.ObjectId) => {
//           const subtask = new Subtask({
//             completed: false,
//             title: subtaskTitle,
//             parent_task_id: task._id,
//           });
//           await subtask.save();
//           return subtask;
//         })
//       );

//       task.subtasks = editedSubtasks.map((subtask) => subtask._id);
//       task.completed_subtasks = editedSubtasks.filter(
//         (subtask) => subtask?.completed === true
//       ).length;
//     }

//     await task.save();

//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// export const editTask = async (req: Request, res: Response) => {
//   try {
//     const { task_id } = req.params;
//     const { title, description, current_status, subtasks } = req.body as {
//       title: string;
//       subtasks?: string[];
//       description?: string;
//       current_status: string;
//     };

//     const task = await Task.findById(task_id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     if (title) {
//       task.title = title;
//     }

//     if (description) {
//       task.description = description;
//     }

//     if (current_status) {
//       task.current_status = current_status;
//     }

//     if (subtasks && subtasks.length > 0) {
//       const existingSubtasks = await Subtask.find({ parent_task_id: task._id });

//       const existingSubtasksMap = new Map(
//         existingSubtasks.map((subtask) => [subtask.title.toString(), subtask])
//       );

//       const newSubtasks = subtasks.filter(
//         (subtaskTitle) => !existingSubtasksMap.has(subtaskTitle)
//       );

//       const addedSubtasks = await Promise.all(
//         newSubtasks.map(async (subtaskTitle: string) => {
//           const subtask = new Subtask({
//             completed: false,
//             title: subtaskTitle,
//             parent_task_id: task._id,
//           });
//           await subtask.save();
//           return subtask;
//         })
//       );

//       task.subtasks = [...existingSubtasks, ...addedSubtasks].map(
//         (subtask) => subtask._id
//       );
//       task.completed_subtasks = existingSubtasks.filter(
//         (subtask) => subtask.completed
//       ).length;
//     }

//     await task.save();

//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const editTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;
    const { title, description, current_status, subtasks } = req.body as {
      title: string;
      subtasks?: string[];
      description?: string;
      current_status: string;
    };

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
      const existingSubtasks = await Subtask.find({ parent_task_id: task._id });

      const existingSubtasksMap = new Map(
        existingSubtasks.map((subtask) => [subtask.title.toString(), subtask])
      );

      // Update existing subtasks and add new subtasks
      const updatedSubtasks = await Promise.all(
        subtasks.map(async (subtaskTitle: string) => {
          if (existingSubtasksMap.has(subtaskTitle)) {
            return existingSubtasksMap.get(subtaskTitle);
          } else {
            const subtask = new Subtask({
              completed: false,
              title: subtaskTitle,
              parent_task_id: task._id,
            });
            await subtask.save();
            return subtask;
          }
        })
      );

      task.subtasks = updatedSubtasks.map((subtask) => subtask._id);
      task.completed_subtasks = updatedSubtasks.filter(
        (subtask) => subtask?.completed === true
      ).length;
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TESTED ✅
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
