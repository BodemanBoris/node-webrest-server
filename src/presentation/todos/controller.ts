import { Response, Request } from "express";

const arrTasks = [
  { id: 1, task: "La chain de leyenda", createdAt: new Date() },
  { id: 2, task: "BORIMAN Sell bike", createdAt: null },
  { id: 3, task: "Buy butter", createdAt: new Date() },
];

export class TodoController {
  public getTodos(req: Request, res: Response) {
    return res.json(arrTasks);
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

  public deleteTask(req: Request, res: Response) {
    const urlId = +req.params.taskId;
    console.log(urlId);

    const arrTaskModified = arrTasks.filter((el) => el.id !== urlId);

    return res
      .status(200)
      .json({ message: "Task had been deleted", arrTaskModified });
  }
}
