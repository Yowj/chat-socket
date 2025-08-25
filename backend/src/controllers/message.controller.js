import Message from "../models/model_message.js";

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender ID and Receiver ID are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId },
      ],
    })
    .populate("sender_id", "username avatar")
    .populate("receiver_id", "username avatar")
    .sort({ createdAt: 1 });

  

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !message) {
      return res.status(400).json({ message: "Receiver ID and message are required" });
    }

    const newMessage = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender_id", "username avatar")
      .populate("receiver_id", "username avatar");

    res.status(201).json({
      message: populatedMessage,
      success: "Message sent successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their message
    if (message.sender_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    const receiverId = message.receiver_id;
    
    await Message.findByIdAndDelete(id);
   
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

