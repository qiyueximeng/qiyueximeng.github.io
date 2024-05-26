<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/" class="logo-link"><img alt="logo" class="logo" src="@/assets/logo.jpeg" width="48" height="48" /></RouterLink>

    <nav>
      <RouterLink to="/blogs">文章</RouterLink>
      <RouterLink to="/practice">练习</RouterLink>
      <!-- <RouterLink to="/thinks">想法</RouterLink> -->
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  padding: 1rem 0;
  background-color: var(--color-background);
  z-index: 999;
}

.logo-link {
  display: block;
  padding: 0;
}

.logo {
  display: block;
  border-radius: 50%;
}

nav {
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    justify-content: space-between;
  }
}
</style>
