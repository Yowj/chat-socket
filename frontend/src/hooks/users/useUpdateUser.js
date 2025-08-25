import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateUser } from "../../lib/api/users";
import toast from "react-hot-toast";

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(data.message || "User updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  return {
    updateUserMutation: mutate,
    isUpdating: isPending,
    updateError: error,
  };
};

export default useUpdateUser;