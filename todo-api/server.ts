#! /usr/bin/env -S deno run --allow-all

import { Application, ObjectId } from "./deps.ts";
import { TodoModel } from "./models/todo.ts";
import { connectMongodb } from "./mongo.ts";

const app = new Application();
await connectMongodb();

app.get("/", () => {
  return "Welcome";
});

app.get("/todos", (ctx) => {
  const todos = TodoModel.find();
  return todos;
});

app.post("/todos", async (ctx) => {
  const { content } = (await ctx.body()) as { content: string };
  TodoModel.create({ content });
  return "success";
});

app.put("/todos/:id", async (ctx) => {
  const { id } = ctx.params;
  const { content } = (await ctx.body()) as { content: string };
  TodoModel.updateOne({ _id: ObjectId(id), content });
  return "success";
});

app.delete("/todos/:id", async (ctx) => {
  const { id } = ctx.params;
  TodoModel.delete({ _id: ObjectId(id) });
  return "success";
});

app.start({ port: 8000 });
console.log("Started");
