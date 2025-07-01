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
        @reply-sent="handleReply"
        @toggle-admin="toggleAdmin"
      />
    </main>

    <footer>
      <button class="admin-btn" @click="toggleAdmin">
        {{ showAdmin ? "Sembunyikan Admin" : "Mode Admin" }}
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MessageForm from "./components/MessageForm.vue";
import AdminPanel from "./components/AdminPanel.vue";
import { fetchMessages, saveMessage, saveReply } from "./api/messageApi";

const messages = ref([]);
const showAdmin = ref(false);

// Load messages on mount
onMounted(async () => {
  messages.value = await fetchMessages();
});

const handleNewMessage = async (message) => {
  const newMessage = await saveMessage(message);
  messages.value.unshift(newMessage);
};

const handleReply = async ({ messageId, reply }) => {
  const updatedMessage = await saveReply(messageId, reply);
  const index = messages.value.findIndex((m) => m.id === messageId);
  if (index !== -1) {
    messages.value[index] = updatedMessage;
  }
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

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
