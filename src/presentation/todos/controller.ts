import { Response, Request } from "express";
import { prisma } from "../../data/postgres/init";
import { CreateTodoDto } from "../../domain/dtos/todos";

const arrTasks = [
  { id: 1, task: "Tu vieja", createdAt: new Date() },
  { id: 2, task: "El raton Boriman", createdAt: null },
  { id: 3, task: "Buy butter", createdAt: new Date() },
];

export class TodoController {
  public getTodos(req: Request, res: Response) {
    return res.json(arrTasks);
  }

  public async getDbTodos(req: Request, res: Response) {
    try {
      const tasks = await prisma.todo.findMany();
      res.status(200).json({ message: "Tasks founded", tasks });
    } catch (error) {
      res.status(400).json({ message: "Tasks was not founded" });
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
      const task = await prisma.todo.findUnique({ where: { id: taskId } });
      res.status(200).json({ message: "Task founded", task });
    } catch (error) {
      res.status(404).json({ message: "Task doesn't exist", error });
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

    if (error) return res.status(400).json({ error });
    try {
      await prisma.todo.create({ data: createTodoDto! });
      return res.status(200).json({ message: "Task was created on Prisma DB" });
    } catch (error) {
      console.error("DB Error:", error); // Muy útil para depuración
      return res
        .status(500)
        .json({ message: "Error creating task in PostgreSQL with Prisma" });
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
    const { task } = req.body;
    const taskId = +req.params.taskId;

    if (typeof task !== "string" || task.trim().length < 1) {
      throw new Error("Task is required");
    }
    try {
      const taskUpdated = await prisma.todo.update({
        where: { id: taskId },
        data: { text: task },
      });
      res.status(200).json({
        message: "task was updated",
        beforeTask: task,
        updatedTask: taskUpdated,
      });
    } catch (error) {}
  }

  public deleteTask(req: Request, res: Response) {
    const urlId = +req.params.taskId;
    console.log(urlId);

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
      await prisma.todo.delete({ where: { id } });
      return res.status(200).json({ message: "Task was deleted" });
    } catch (error) {
      const customError = `Error: ${error}`;
      return res.status(400).json({ message: customError });
    }
  }
}
