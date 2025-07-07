export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) {}

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromObject(object: { [key: string]: any }): TodoEntity {
    const { id, text, completedAt } = object;
    if (!id || id < 1 || isNaN(Number(id)))
      throw new Error("Id is required and must to be a valid number");
    if (!text) throw new Error("Text is required");
    let newCompletedAt;

    if (completedAt) {
      newCompletedAt = new Date(completedAt);
      if (isNaN(newCompletedAt.getTime())) {
        throw "CompletedAt must to be a valid Date";
      }
    }

    return new TodoEntity(id, text, completedAt);
  }
}
