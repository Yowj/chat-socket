import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "../../lib/api/users";
import toast from "react-hot-toast";

const useUsers = () => {
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message || "User deleted successfully");
    },
  });

  return {
    isLoading: users.isLoading,
    users: users.data,
    error: users.error,
    refetch: users.refetch,
  };
};

export default useUsers;
