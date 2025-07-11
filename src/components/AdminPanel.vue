<template>
  <div class="admin-panel">
    <div class="panel-header">
      <h2>Balasan Pesan</h2>
    </div>

    <div class="message-list">
      <div v-for="msg in filteredMessages" :key="msg.id" class="message-card">
        <div class="message-header">
          <span class="sender">{{ msg.sender }}</span>
          <span class="timestamp">{{ formatDate(msg.timestamp) }}</span>
        </div>
        <div class="message-content">
          {{ msg.message }}
        </div>

        <div v-if="msg.reply" class="reply-section">
          <div class="reply-header">Balasan Anda:</div>
          <div class="reply-content">{{ msg.reply }}</div>
        </div>
        <div v-else class="reply-form">
          <textarea
            v-model="replyTexts[msg.id]"
            placeholder="Tulis balasan Anda..."
            rows="3"
            class="reply-textarea"
          ></textarea>
          <button
            @click="sendReply(msg.id)"
            class="reply-btn"
            :disabled="!replyTexts[msg.id]"
          >
            Kirim Balasan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["reply-sent", "toggle-admin"]);

const replyTexts = ref({});

const filteredMessages = computed(() => {
  return [...props.messages].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
});

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const sendReply = (messageId) => {
  if (!replyTexts.value[messageId]) return;

  emit("reply-sent", {
    messageId,
    reply: replyTexts.value[messageId],
  });

  replyTexts.value[messageId] = "";
};
</script>

<style scoped>
.admin-panel {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--secondary-color);
}

.panel-header {
  text-align: center;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}

.panel-header h2 {
  color: var(--primary-color);
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.sender {
  font-weight: bold;
  color: var(--primary-color);
}

.timestamp {
  color: #666;
}

.message-content {
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.reply-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #ddd;
}

.reply-header {
  font-weight: bold;
  color: var(--success-color);
  margin-bottom: 0.5rem;
}

.reply-content {
  background: rgba(0, 184, 148, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  white-space: pre-wrap;
}

.reply-form {
  margin-top: 1rem;
}

.reply-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

.reply-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.reply-btn {
  background-color: var(--success-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reply-btn:hover {
  background-color: #00a884;
}

.reply-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
