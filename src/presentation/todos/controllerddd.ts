import { Response, Request } from "express";
import { prisma } from "../../data/postgres/init";
import {
  CreateTodoDto,
  TodoRepository,
  UpdateTodoDto,
} from "../../domain/index";

const arrTasks = [
  { id: 1, task: "Tu vieja", createdAt: new Date() },
  { id: 2, task: "El raton Boriman", createdAt: null },
  { id: 3, task: "Buy butter", createdAt: new Date() },
];

export class TodoController {
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos(req: Request, res: Response) {
    return res.json(arrTasks);
  }

  public async getDbTodos(req: Request, res: Response) {
    try {
      const todos = await this.todoRepository.getAll();
      return res.status(200).json({ todos });
    } catch (error) {
      return res.status(400).json({ message: `Todo list doesn't exist` });
    }
  }

  public getTodoById(req: Request, res: Response) {
    const taskId = parseInt(req.params.taskId);
    if (isNaN(taskId))
      return res.status(400).json({ error: "URL params must to be a number" });

    let taskById = arrTasks.filter((el) => el.id === taskId);

    if (taskById.length === 0) {
      return res.status(404).json("Id does'nt exist");
    }
    return res.json(taskById);
  }

  public async getDbTodoById(req: Request, res: Response) {
    const taskId = +req.params.taskId;

    try {
      const todo = await this.todoRepository.findById(taskId);

      return res.status(200).json({ todo });
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Todo with id: ${taskId} doesn't exist` });
    }
  }

  public createTask(req: Request, res: Response) {
    const body = req.body;
    const taskId = Date.now();

    if (body.task.length === 0 || typeof body.task !== "string") {
      return res
        .status(404)
        .json("Task is obligatory and must to be an string");
    }
    const tarea = {
      id: taskId,
      task: body.task.trim(),
      createdAt: new Date(),
    };

    arrTasks.push(tarea);

    return res.status(202).json({
      message: "A new Task was created",
      arrTasks,
    });
  }

  public async createDbTask(req: Request, res: Response) {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) return res.status(404).json({ error });

    try {
      const todoCreated = await this.todoRepository.create(createTodoDto!);
      return res.status(200).json({ todoCreated });
    } catch (error) {
      return res.status(400).json({ message: `Error to create a new Todo` });
    }
  }

  public updateTask(req: Request, res: Response) {
    const urlId = +req.params.taskId;
    const body = req.body;

    if (typeof urlId !== "number" || urlId < 1) {
      return res.status(404).json("ID must to be a positive number");
    }

    let foundedTask = arrTasks.find((el) => el.id === urlId);
    if (!foundedTask) {
      return res.status(404).json(`Task was not founded`);
    }

    arrTasks.map((el, i) => {
      if (el.id === foundedTask?.id) {
        arrTasks[i] = {
          id: el.id,
          createdAt: el.createdAt,
          task: body.task,
        };
      }
    });

    return res.status(200).json({ message: "Task was updated", arrTasks });
  }

  public async updateDbTask(req: Request, res: Response) {
    const taskId = +req.params.taskId;

    const [error, updatedTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id: taskId,
    });

    if (error) return res.status(400).json({ error });

    try {
      const taskUpdated = await this.todoRepository.updateById(updatedTodoDto!);

      res.status(200).json({
        message: "task was updated",
        updatedTask: taskUpdated,
      });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public deleteTask(req: Request, res: Response) {
    const urlId = +req.params.taskId;

    const arrTaskModified = arrTasks.filter((el) => el.id !== urlId);

    return res
      .status(200)
      .json({ message: "Task had been deleted", arrTaskModified });
  }

  public async deleteDbTask(req: Request, res: Response) {
    const id = +req.params.taskId;

    if (typeof id !== "number" || id < 0) {
      throw new Error("'ID' must exist and be a positive number");
    }

    try {
      const deletedTodo = await this.todoRepository.deleteById(id);
      return res.status(200).json({ message: "Task was deleted", deletedTodo });
    } catch (error) {
      const customError = `Error: ${error}`;
      return res.status(400).json({ message: customError });
    }
  }
}
