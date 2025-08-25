import { useQueryClient, useMutation } from "@tanstack/react-query";
import { sendMessage } from "../../lib/api/messages";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(data.success || "Message sent successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });

  return {
    sendMessage: mutate,
    isSending: isPending,
    sendError: error,
  };
};

export default useSendMessage;
