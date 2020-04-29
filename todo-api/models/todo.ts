import { MongoModel } from "./base.ts";

export class TodoSchema {
  content!: string;
  completed?: boolean = false;

  created_at?: Date = new Date();
  updated_at?: Date = new Date();
}

export const TodoModel = new MongoModel(TodoSchema, "todos");
