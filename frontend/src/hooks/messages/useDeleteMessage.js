import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteMessage } from "../../lib/api/messages";
import toast from "react-hot-toast";

const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: deleteMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(data.message || "Message deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete message");
    },
  });

  return {
    deleteMessage: mutate,
    isDeleting: isPending,
    deleteError: error,
  };
};

export default useDeleteMessage;