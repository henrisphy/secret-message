<template>
  <div class="message-form">
    <form @submit.prevent="handleSubmit" class="card">
      <h2>Kirim Pesan Rahasia</h2>
      <div class="form-group">
        <label for="sender">Nama Anda (opsional):</label>
        <input
          type="text"
          id="sender"
          v-model="sender"
          placeholder="Anonymous"
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="message">Pesan Anda:</label>
        <textarea
          id="message"
          v-model="message"
          required
          rows="5"
          class="form-control"
          placeholder="Tulis pesan rahasia Anda di sini..."
        ></textarea>
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Mengirim..." : "Kirim Pesan" }}
      </button>
    </form>

    <div v-if="showSuccess" class="success-message">
      Pesan Anda telah terkirim! Hanya saya yang bisa melihat dan membalasnya.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["message-sent"]);

const sender = ref("");
const message = ref("");
const isSubmitting = ref(false);
const showSuccess = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;

  const newMessage = {
    sender: sender.value || "Anonymous",
    message: message.value,
    timestamp: new Date().toISOString(),
    reply: null,
  };

  emit("message-sent", newMessage);

  // Reset form
  sender.value = "";
  message.value = "";
  isSubmitting.value = false;
  showSuccess.value = true;

  setTimeout(() => {
    showSuccess.value = false;
  }, 5000);
};
</script>

<style scoped>
.message-form {
  margin-bottom: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: var(--secondary-color);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(0, 184, 148, 0.2);
  border-left: 4px solid var(--success-color);
  border-radius: 4px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
