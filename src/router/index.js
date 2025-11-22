import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protect dashboard only
router.beforeEach(async (to, from, next) => {
  const protectedPages = ["/dashboard"];
  if (!protectedPages.includes(to.path)) return next();

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
      credentials: "include"
    });
    const data = await res.json();
    if (data.user) next();
    else next("/");
  } catch {
    next("/");
  }
});

export default router;
