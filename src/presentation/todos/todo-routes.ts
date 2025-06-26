import { Router } from "express";
import { TodoController } from "./controller";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();
    const todoController = new TodoController();

    router.get("/", (req, res) => todoController.getTodos(req, res));
    router.get("/db/", (req, res) => todoController.getDbTodos(req, res));
    router.get("/:taskId", (req, res) => todoController.getTodoById(req, res));
    router.get("/db/:taskId", (req, res) =>
      todoController.getDbTodoById(req, res)
    );
    router.post("/", (req, res) => todoController.createTask(req, res));
    router.post("/db/", (req, res) => todoController.createDbTask(req, res));
    router.put("/:taskId", (req, res) => todoController.updateTask(req, res));
    router.put("/db/:taskId", (req, res) =>
      todoController.updateDbTask(req, res)
    );
    router.delete("/:taskId", (req, res) =>
      todoController.deleteTask(req, res)
    );

    router.delete("/db/:taskId", (req, res) =>
      todoController.deleteDbTask(req, res)
    );

    return router;
  }
}
