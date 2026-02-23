export interface Todo {
  id: string;
  user_id: string;
  task: string;
  is_completed: boolean;
  created_at: string;
}

export type NewTodo = Omit<Todo, 'id' | 'created_at' | 'user_id'>;
