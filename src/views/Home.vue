<template>
  <div class="home-container">
    <h1>Welcome to Pathfinder Portal</h1>

    <div v-if="$route.query.error === 'not_verified'" class="error">
      You're not a verified student of Pathfinder Institute Myanmar
    </div>

    <div v-if="user" class="dashboard-redirect">
      <p>Go to your dashboard</p>
      <button @click="$router.push('/dashboard')">Dashboard</button>
    </div>

    <div v-else>
      <button @click="$router.push('/login')">Login with Google</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: "include"
    });
    const data = await res.json();
    user.value = data.user;
  } catch {}
});
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 100px;
  padding: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  background: #fff;
}
button {
  background-color: #4285f4;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
}
button:hover { opacity: 0.9; }
.error {
  color: red;
  margin-bottom: 20px;
}
.dashboard-redirect {
  margin-top: 20px;
}
</style>
