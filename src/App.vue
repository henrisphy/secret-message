<template>
  <div class="app">
    <header>
      <h1>Secret Message</h1>
      <p>Kirim pesan rahasia kepada saya</p>
    </header>

    <main>
      <MessageForm @message-sent="handleNewMessage" />
      <AdminPanel
        v-if="showAdmin"
        :messages="messages"
        @reply-sent="handleReplyAttempt"
        @toggle-admin="toggleAdmin"
      />
    </main>

    <footer>
      <button class="admin-btn" @click="toggleAdmin">
        {{ showAdmin ? "Sembunyikan Pesan" : "Lihat Semua Pesan" }}
      </button>
    </footer>

    <!-- Password Popup -->
    <div v-if="showPasswordPopup" class="password-popup-overlay">
      <div class="password-popup">
        <h3>Verifikasi Admin</h3>
        <input
          type="password"
          v-model="adminPassword"
          placeholder="Masukkan password admin"
          @keyup.enter="verifyPassword"
        />
        <div class="popup-buttons">
          <button @click="verifyPassword" class="confirm-btn">
            Konfirmasi
          </button>
          <button @click="cancelReply" class="cancel-btn">Batal</button>
        </div>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MessageForm from "./components/MessageForm.vue";
import AdminPanel from "./components/AdminPanel.vue";
import { fetchMessages, saveMessage, saveReply } from "./api/messageApi";

// Data state
const messages = ref([]);
const showAdmin = ref(false);
const showPasswordPopup = ref(false);
const adminPassword = ref("");
const passwordError = ref("");
const pendingReply = ref(null);

// Password admin (ganti dengan password yang Anda inginkan)
const ADMIN_PASSWORD = "admin123";

// Load messages on mount
onMounted(async () => {
  messages.value = await fetchMessages();
});

const handleNewMessage = async (message) => {
  const newMessage = await saveMessage(message);
  messages.value.unshift(newMessage);
};

const handleReplyAttempt = ({ messageId, reply }) => {
  pendingReply.value = { messageId, reply };
  showPasswordPopup.value = true;
};

const verifyPassword = async () => {
  if (adminPassword.value === ADMIN_PASSWORD) {
    // Password benar, kirim balasan
    const { messageId, reply } = pendingReply.value;
    const updatedMessage = await saveReply(messageId, reply);
    const index = messages.value.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }
    resetPasswordPopup();
  } else {
    passwordError.value = "Password salah! Anda tidak bisa mengirim pesan.";
    setTimeout(() => {
      passwordError.value = "";
    }, 3000);
  }
};

const cancelReply = () => {
  resetPasswordPopup();
};

const resetPasswordPopup = () => {
  showPasswordPopup.value = false;
  adminPassword.value = "";
  pendingReply.value = null;
  passwordError.value = "";
};

const toggleAdmin = () => {
  showAdmin.value = !showAdmin.value;
};
</script>

<style>
/* Reset dan Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #6c5ce7;
  --secondary-color: #a29bfe;
  --dark-color: #2d3436;
  --light-color: #f5f6fa;
  --success-color: #00b894;
  --warning-color: #fdcb6e;
  --danger-color: #d63031;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--light-color);
  color: var(--dark-color);
  line-height: 1.6;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-in-out;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

main {
  flex: 1;
}

footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.admin-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-btn:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

/* Password Popup Styles */
.password-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.password-popup {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: popupFadeIn 0.3s ease-out;
}

.password-popup h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  text-align: center;
}

.password-popup input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.password-popup input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.popup-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.popup-buttons button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn {
  background-color: var(--success-color);
  color: white;
}

.confirm-btn:hover {
  background-color: #00a884;
}

.cancel-btn {
  background-color: var(--danger-color);
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.error-message {
  color: var(--danger-color);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
