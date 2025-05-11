<template>
  <header class="p-header">
    <div class="p-header-left">
      <button class="p-menu-toggle" @click="$emit('toggle-sidebar')">
        <i class="pi pi-bars"></i>
      </button>
      <h1 class="p-title">{{ pageTitle }}</h1>
      <Breadcrumb :model="breadcrumbItems" class="p-breadcrumb-custom" />
    </div>
    <div class="p-header-right">
      <div class="p-search">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText placeholder="Search..." />
        </span>
      </div>
      <div class="p-header-actions">
        <Button icon="pi pi-bell" class="p-button-rounded p-button-text p-button-plain" badge="3" badgeClass="p-badge-danger" />
        <Button icon="pi pi-envelope" class="p-button-rounded p-button-text p-button-plain" badge="5" badgeClass="p-badge-info" />
        <Menu ref="userMenu" :model="userMenuItems" :popup="true" />
        <Button @click="toggleUserMenu" class="p-button-text p-button-plain p-user-button">
          <div class="p-avatar-wrapper">
<!--            <img src="@/assets/avatar-placeholder.svg" alt="User Avatar" class="p-avatar-image" />-->
          </div>
          <span class="p-user-name">Admin User</span>
          <i class="pi pi-angle-down"></i>
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const userMenu = ref();

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event);
};

const pageTitle = computed(() => {
  const routeName = route.name;
  if (typeof routeName === 'string') {
    return routeName.replace(/([A-Z])/g, ' $1').trim();
  }
  return 'Dashboard';
});

const breadcrumbItems = computed(() => {
  const items = [{ label: 'Home', to: '/admin/dashboard' }];

  if (route.matched.length > 1) {
    route.matched.slice(1).forEach(match => {
      if (match.name) {
        items.push({
          label: String(match.name).replace(/([A-Z])/g, ' $1').trim(),
          to: match.path
        });
      }
    });
  }

  return items;
});

const userMenuItems = [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      // Handle profile click
    }
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      // Handle settings click
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      // Handle logout
    }
  }
];
</script>

<style scoped>
.p-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: var(--surface-a);
  border-bottom: 1px solid var(--surface-d);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 64px;
}

.p-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.p-menu-toggle {
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
}

.p-menu-toggle:hover {
  background-color: var(--surface-c);
}

.p-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
  margin-right: 1.5rem;
}

.p-breadcrumb-custom {
  display: none;
}

.p-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.p-search {
  min-width: 200px;
}

.p-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-user-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.p-avatar-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.p-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.p-user-name {
  display: none;
}

@media (min-width: 768px) {
  .p-breadcrumb-custom {
    display: block;
  }

  .p-search {
    min-width: 300px;
  }

  .p-user-name {
    display: inline;
    font-weight: 500;
  }
}
</style>
