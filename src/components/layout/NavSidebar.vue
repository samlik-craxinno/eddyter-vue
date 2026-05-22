<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { NAV_ITEMS } from '../../navigation/nav-items'
</script>

<template>
  <nav class="nav-sidebar" aria-label="Main">
    <ul class="nav-sidebar__list">
      <li v-for="item in NAV_ITEMS" :key="item.id">
        <RouterLink
          :to="item.path"
          class="nav-sidebar__link"
          active-class="nav-sidebar__link--active"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-sidebar {
  padding: 1rem 0.75rem;
}

.nav-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-sidebar__link {
  display: block;
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.nav-sidebar__link:hover {
  background: var(--accent-bg);
  color: var(--text-h);
}

.nav-sidebar__link--active {
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}

@media (max-width: 768px) {
  .nav-sidebar__list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
