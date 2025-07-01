<script setup>
import { ref, onMounted } from "vue";
import { getMessages, addReply } from "../utils/api";

const messages = ref([]);
const isLoading = ref(false);
const error = ref(null);
const replyingTo = ref(null);
const replyContent = ref("");

const fetchMessages = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const data = await getMessages();
    messages.value = data;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const startReply = (id) => {
  replyingTo.value = id;
  replyContent.value = "";
};

const submitReply = async (id) => {
  if (!replyContent.value.trim()) return;

  isLoading.value = true;
  error.value = null;

  try {
    await addReply(id, replyContent.value);
    await fetchMessages();
    replyingTo.value = null;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchMessages);
</script>

<template>
  <div class="message-list">
    <h2>Pesan Masuk</h2>

    <div v-if="isLoading && messages.length === 0" class="loading">
      Memuat pesan...
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="messages.length === 0 && !isLoading" class="empty">
      Belum ada pesan
    </div>

    <div v-for="message in messages" :key="message.id" class="message-item">
      <div class="message-content">{{ message.content }}</div>
      <div class="message-date">
        {{ new Date(message.created_at).toLocaleString() }}
      </div>

      <div v-if="message.is_replied" class="reply-section">
        <strong>Balasan:</strong>
        <div class="reply-content">{{ message.reply }}</div>
      </div>

      <div v-else class="reply-action">
        <button @click="startReply(message.id)" class="reply-button">
          Balas
        </button>

        <div v-if="replyingTo === message.id" class="reply-form">
          <textarea
            v-model="replyContent"
            placeholder="Tulis balasan..."
          ></textarea>
          <button @click="submitReply(message.id)" class="submit-reply">
            Kirim Balasan
          </button>
          <button @click="replyingTo = null" class="cancel-reply">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}

.message-list h2 {
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.message-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.message-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.reply-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ddd;
}

.reply-content {
  margin-top: 5px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

.reply-action {
  margin-top: 10px;
}

.reply-button {
  background: #2196f3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.reply-button:hover {
  background: #0b7dda;
}

.reply-form {
  margin-top: 10px;
}

.reply-form textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.submit-reply {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;
}

.submit-reply:hover {
  background: #45a049;
}

.cancel-reply {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.cancel-reply:hover {
  background: #d32f2f;
}

.loading,
.empty {
  text-align: center;
  color: #fff;
  padding: 20px;
}

.error-message {
  color: #f44336;
  text-align: center;
  padding: 10px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
  margin-bottom: 15px;
}
</style>
