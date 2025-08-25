import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../lib/api/messages";

const useMessages = ({ senderId, receiverId }) => {
  const messages = useQuery({
    queryKey: ["messages", senderId, receiverId],
    queryFn: () => getMessages({ senderId, receiverId }),
    enabled: !!senderId && !!receiverId,
  
  });

  return {
    isLoading: messages.isLoading,
    messages: messages.data,
    error: messages.error,
  };
};

export default useMessages;
