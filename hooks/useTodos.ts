import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Todo, NewTodo } from "@/types/todo";
import { toast } from "sonner";

const supabase = createClient();

export function useTodos() {
  const queryClient = useQueryClient();

  // 사용자 정보 가져오기 (RLS 정책용)
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  // 1. 할 일 목록 조회 (Read)
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });

  const todosQuery = useQuery({
    queryKey: ['todos', user?.id],
    queryFn: async (): Promise<Todo[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // 2. 할 일 추가 (Create)
  const addTodoMutation = useMutation({
    mutationFn: async (task: string) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      const newTodo: NewTodo = { task, is_completed: false };

      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...newTodo, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("할 일이 추가되었습니다.");
    },
    onError: (error) => {
      toast.error("할 일 추가에 실패했습니다: " + error.message);
    }
  });

  // 3. 할 일 완료 상태 변경 (Update)
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ is_completed: !is_completed })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      toast.error("상태 변경에 실패했습니다: " + error.message);
    }
  });

  // 4. 할 일 삭제 (Delete)
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("할 일이 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error("할 일 삭제에 실패했습니다: " + error.message);
    }
  });

  return {
    todos: todosQuery.data || [],
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,
    addTodo: (task: string) => addTodoMutation.mutate(task),
    toggleTodo: ({ id, is_completed }: { id: string; is_completed: boolean }) => toggleTodoMutation.mutate({ id, is_completed }),
    deleteTodo: (id: string) => deleteTodoMutation.mutate(id),
    isAdding: addTodoMutation.isPending,
  };
}
