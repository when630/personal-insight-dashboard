"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle, CheckSquare } from "lucide-react";

export default function TodosPage() {
  const { todos, isLoading, isError, addTodo, toggleTodo, deleteTodo, isAdding } = useTodos();
  const [taskName, setTaskName] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    addTodo(taskName, {
      onSuccess: () => setTaskName("")
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center text-muted-foreground">
        할 일 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex justify-center text-destructive">
        할 일 목록을 불러올 수 없습니다. 확인 후 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 bg-background">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">나의 할 일</h1>
          <p className="text-muted-foreground mt-1">
            해야 할 일들을 추가하고 관리해보세요.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              할 일 리스트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
              <Input
                placeholder="새로운 할 일을 입력하세요... (예: 1시 은행 방문)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                disabled={isAdding}
                className="flex-1"
              />
              <Button type="submit" disabled={isAdding || !taskName.trim()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                추가
              </Button>
            </form>

            {todos.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed mt-4">
                현재 등록된 할 일이 없습니다. 새로운 할 일을 추가해보세요.
              </div>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex justify-between items-center p-3 rounded-md border bg-card hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={todo.id}
                        checked={todo.is_completed}
                        onCheckedChange={() => toggleTodo({ id: todo.id, is_completed: todo.is_completed })}
                      />
                      <label
                        htmlFor={todo.id}
                        className={`text-sm font-medium leading-none cursor-pointer select-none ${todo.is_completed ? "line-through text-muted-foreground" : ""
                          }`}
                      >
                        {todo.task}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
