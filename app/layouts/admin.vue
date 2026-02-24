<script setup lang="ts">
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Briefcase,
  Mail,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const auth = useAuth()
const route = useRoute()
const mobileMenuOpen = ref(false)

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Projects', icon: FolderKanban, to: '/admin/projects' },
  { label: 'Skills', icon: Cpu, to: '/admin/skills' },
  { label: 'Experience', icon: Briefcase, to: '/admin/experiences' },
  { label: 'Messages', icon: Mail, to: '/admin/contacts' },
]

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<template>
  <!-- Outer frame: transparent so fixed gradient shows through, including in margins -->
  <div class="min-h-screen p-3 sm:p-4 lg:p-6">
    <!-- Same gradient background as the portfolio page -->
    <EffectsGradientBackground />

    <div class="relative z-10 flex min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] flex-col rounded-xl border border-primary/20 bg-background/30 overflow-hidden">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 border-b border-primary/20 bg-background/40 backdrop-blur-md rounded-t-xl">
      <div class="flex h-14 items-center px-5 gap-4">
        <Button
          variant="ghost"
          size="sm"
          class="lg:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>

        <NuxtLink to="/admin" class="font-retro text-sm text-primary retro-glow">
          Admin Panel
        </NuxtLink>

        <div class="ml-auto flex items-center gap-2">
          <Button as="a" href="/" variant="ghost" size="sm">
            <Home class="h-4 w-4 mr-1" />
            Site
          </Button>
          <Button variant="ghost" size="sm" @click="auth.logout()">
            <LogOut class="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-30 w-60 border-r border-primary/20 bg-background/30 backdrop-blur-sm pt-14 transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <nav class="flex flex-col gap-1 p-3">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive(item.to)
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            ]"
            @click="mobileMenuOpen = false"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Overlay for mobile -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="mobileMenuOpen = false"
      />

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div class="mx-auto max-w-6xl">
          <slot />
        </div>
      </main>
    </div>
    </div>
  </div>
</template>
