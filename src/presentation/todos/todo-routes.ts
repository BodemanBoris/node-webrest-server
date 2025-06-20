import { Router } from "express";
import { TodoController } from "./controller";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const todoController = new TodoController();

    router.get("/", (req, res) => todoController.getTodos(req, res));
    router.get("/:taskId", (req, res) => todoController.getTodoById(req, res));
    router.post("/", (req, res) => todoController.createTask(req, res));
    router.put("/:taskId", (req, res) => todoController.updateTask(req, res));
    router.delete("/:taskId", (req, res) =>
      todoController.deleteTask(req, res)
    );

    return router;
  }
}
