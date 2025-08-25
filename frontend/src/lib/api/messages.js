import { axiosInstance } from "../axios";

export const getMessages = async ({ senderId, receiverId }) => {
  const response = await axiosInstance.get("/message/messages", {
    params: {
      senderId,
      receiverId,
    },
  });
  return response.data;
};

export const sendMessage = async ({ receiverId, message }) => {
  const response = await axiosInstance.post("/message/send", {
    receiverId,
    message,
  });
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await axiosInstance.delete(`/message/${messageId}`);
  return response.data;
};

export const getConversations = async () => {
  const response = await axiosInstance.get("/message/conversations");
  return response.data;
};