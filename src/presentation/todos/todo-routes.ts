import { Router } from "express";
import { TodoController } from "./controller";
import { TodoDatasource } from "../../domain";
import { TodoDatasourcesImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repository/todo.repository.impl";

export class TodoRoutes {
  static get routes(): Router {
    const router = Router();

    const todoDatasource = new TodoDatasourcesImpl();

    const todoRepository = new TodoRepositoryImpl(todoDatasource);

    const todoController = new TodoController(todoRepository);

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
