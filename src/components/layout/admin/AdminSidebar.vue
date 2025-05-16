<template>
  <aside class="p-sidebar" :class="{ 'p-sidebar-collapsed': collapsed }">
    <div class="p-sidebar-header">
      <div class="p-logo-container">
        <Logo />
      </div>
      <button class="p-collapse-btn" @click="$emit('toggle-sidebar')">
        <i class="pi" :class="collapsed ? 'pi-chevron-right' : 'pi-chevron-left'"></i>
      </button>
    </div>
    <div class="p-sidebar-content">
      <div class="p-menu">
        <div v-for="(item, index) in menuItems" :key="index" class="p-menu-category">
          <div v-if="!collapsed" class="p-menu-category-label">{{ item.label }}</div>
          <ul class="p-menu-list">
            <li v-for="(menuItem, idx) in item.items" :key="idx" class="p-menu-item">
              <router-link
                :to="menuItem.to"
                class="p-menu-link"
                :class="{ active: isActive(menuItem.to) }"
              >
                <i class="p-menu-icon" :class="menuItem.icon"></i>
                <span v-if="!collapsed" class="p-menu-text">{{ menuItem.label }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

defineEmits(['toggle-sidebar'])

const route = useRoute()

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const menuItems = computed(() => [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: 'pi pi-home', to: '/admin/dashboard' },
      { label: 'Analytics', icon: 'pi pi-chart-bar', to: '/admin/analytics' },
    ],
  },
  {
    label: 'User Management',
    items: [
      { label: 'Users', icon: 'pi pi-users', to: '/admin/user-management/users' },
      { label: 'Roles', icon: 'pi pi-id-card', to: '/admin/user-management/roles' },
      { label: 'Permissions', icon: 'pi pi-lock', to: '/admin/user-management/permissions' },
    ],
  },
  {
    label: 'Academic',
    items: [
      { label: 'Departments', icon: 'pi pi-sitemap', to: '/admin/academic/departments' },
      { label: 'Programs', icon: 'pi pi-book', to: '/admin/academic/programs' },
      { label: 'Courses', icon: 'pi pi-list', to: '/admin/academic/courses' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: 'pi pi-cog', to: '/admin/settings' },
      { label: 'Logs', icon: 'pi pi-history', to: '/admin/logs' },
    ],
  },
])
</script>

<style scoped>
.p-sidebar {
  width: 250px;
  background-color: var(--primary-color);
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.p-sidebar-collapsed {
  width: 65px;
}

.p-sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.p-logo-container {
  overflow: hidden;
  height: 40px;
  display: flex;
  align-items: center;
}

.p-logo {
  height: 30px;
  max-width: 100%;
}

.p-logo-small {
  height: 30px;
  width: 30px;
}

.p-collapse-btn {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.p-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.p-menu-category {
  margin-bottom: 1.2rem;
}

.p-menu-category-label {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.p-menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.p-menu-item {
  margin: 2px 0;
}

.p-menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
}

.p-menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.p-menu-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 500;
}

.p-menu-icon {
  font-size: 1.25rem;
  width: 1.5rem;
  margin-right: 0.75rem;
  text-align: center;
}

.p-sidebar-collapsed .p-menu-text {
  display: none;
}

.p-sidebar-collapsed .p-menu-category-label {
  display: none;
}

.p-sidebar-collapsed .p-menu-link {
  justify-content: center;
  padding: 0.75rem 0;
}

.p-sidebar-collapsed .p-menu-icon {
  margin-right: 0;
}

@media (max-width: 768px) {
  .p-sidebar {
    transform: translateX(-100%);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .p-sidebar.p-sidebar-mobile-visible {
    transform: translateX(0);
  }

  .p-sidebar-collapsed {
    transform: translateX(-100%);
  }
}
</style>
