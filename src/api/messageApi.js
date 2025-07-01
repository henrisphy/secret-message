import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Konfigurasi JSONBin.io
const BIN_ID = "68637eda8561e97a502f7038"; // Ganti dengan bin ID Anda
const API_KEY = "$2a$10$QPPraHhIuKf/yJwcrg68Z.o0AQRHkZ6d5I6lphE2nosd7lIVp5T4C"; // Ganti dengan API key Anda

const api = axios.create({
  baseURL: `https://api.jsonbin.io/v3/b/${BIN_ID}`,
  headers: {
    "X-Master-Key": API_KEY,
    "Content-Type": "application/json",
  },
});

// Fungsi untuk mengambil semua pesan
export const fetchMessages = async () => {
  try {
    const response = await api.get("/latest");
    return response.data.record.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

// Fungsi untuk menyimpan pesan baru
export const saveMessage = async (message) => {
  const messages = await fetchMessages();
  const newMessage = {
    ...message,
    id: uuidv4(),
  };

  const updatedMessages = [newMessage, ...messages];

  try {
    await api.put("/", { messages: updatedMessages });
    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

// Fungsi untuk menyimpan balasan
export const saveReply = async (messageId, reply) => {
  const messages = await fetchMessages();
  const messageIndex = messages.findIndex((m) => m.id === messageId);

  if (messageIndex === -1) {
    throw new Error("Message not found");
  }

  const updatedMessage = {
    ...messages[messageIndex],
    reply,
    repliedAt: new Date().toISOString(),
  };

  const updatedMessages = [...messages];
  updatedMessages[messageIndex] = updatedMessage;

  try {
    await api.put("/", { messages: updatedMessages });
    return updatedMessage;
  } catch (error) {
    console.error("Error saving reply:", error);
    throw error;
  }
};
