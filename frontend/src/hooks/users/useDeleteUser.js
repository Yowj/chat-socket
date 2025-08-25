import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../lib/api/users";
import toast from "react-hot-toast";

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message || "User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  return {
    deleteUserMutation: mutate,
    isDeleting: isPending,
    deleteError: error,
  };
};

export default useDeleteUser;