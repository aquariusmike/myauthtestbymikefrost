<template>
  <div class="login-container">
    <h1>Login Page</h1>
    <button @click="loginGoogle">Login with Google</button>
  </div>
</template>

<script setup>
function loginGoogle() {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
}
</script>

<style scoped>
.login-container {
  text-align: center;
  margin-top: 150px;
}
button {
  background-color: #4285f4;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { opacity: 0.9; }
</style>
