<script setup>
const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  console.log("Handle the response", response)
}
</script>


<template>
  <router-view />
  <footer>
    <div style="text-align: center; padding: 20px; color: #888; display: block; position: fixed; bottom: 0; width: 100%; background: #f9f9f9;">
      <p>2025 MyAuth Test. Made by Mike Frost</p>
    </div>
  </footer>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
