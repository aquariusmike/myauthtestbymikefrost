<template>
  <div class="dashboard-container">
    <h1>Student Dashboard</h1>
    <p>Welcome, `{{ user?.name}}  {{user?.email }}`</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: "include"
    });
    const data = await res.json();
    if (!data.user) router.push("/");
    user.value = data.user;
  } catch {
    router.push("/");
  }
});

async function logout() {
  try {
    // Call serverless logout to clear cookie
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      credentials: "include"
    });

    // Reset local state
    user.value = null;

    // Redirect to home
    router.push("/");
  } catch (err) {
    console.error(err);
  }
}

</script>

<style scoped>
.dashboard-container {
  text-align: center;
  margin-top: 100px;
  padding: 30px;
  max-width: 500px;
  margin: auto;
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
</style>
