import { prisma } from "../../data/postgres/init";
import {
  CreateTodoDto,
  TodoDatasource,
  TodoEntity,
  UpdateTodoDto,
} from "../../domain";

export class TodoDatasourcesImpl implements TodoDatasource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: createTodoDto,
    });

    return TodoEntity.fromObject(todo);
  }
  async getAll(): Promise<TodoEntity[]> {
    const tasks = await prisma.todo.findMany();

    return tasks.map(TodoEntity.fromObject);
  }
  async findById(id: number): Promise<TodoEntity> {
    const task = await prisma.todo.findUnique({ where: { id } });
    if (!task) throw new Error(`Task with id: ${id} not founded`);
    return TodoEntity.fromObject(task);
  }
  async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const task = await this.findById(updateTodoDto.id);

    if (!task) throw new Error(`Task with id: ${updateTodoDto.id} not founded`);
    const updatedTodo = await prisma.todo.update({
      where: { id: updateTodoDto.id },
      data: updateTodoDto.values,
    });
    return TodoEntity.fromObject(updatedTodo);
  }
  async deleteById(id: number): Promise<TodoEntity> {
    await this.findById(id);

    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });

    return TodoEntity.fromObject(deletedTodo);
  }
}
