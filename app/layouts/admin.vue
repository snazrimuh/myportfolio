<script setup lang="ts">
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  Briefcase,
  Mail,
  LogOut,
  Home,
  UserCircle,
  Sun,
  Moon,
} from 'lucide-vue-next'

const auth = useAuth()
const route = useRoute()
const { isDark, toggleTheme, initTheme } = useTheme()

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Profile',   icon: UserCircle,      to: '/admin/profile' },
  { label: 'Projects',  icon: FolderOpen,      to: '/admin/projects' },
  { label: 'Skills',    icon: Layers,          to: '/admin/skills' },
  { label: 'Experience',icon: Briefcase,       to: '/admin/experiences' },
  { label: 'Messages',  icon: Mail,            to: '/admin/contacts' },
]

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

onMounted(() => initTheme())
</script>

<template>
  <div class="min-h-screen bg-background text-foreground antialiased">
    <EffectsGradientBackground />
    <ScrollProgress />

    <!-- ── Desktop pill nav (left, fixed, centered) ── -->
    <nav
      class="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-start gap-2"
      aria-label="Admin navigation"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        class="group flex items-center gap-3 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <!-- Active pill -->
        <div
          v-if="isActive(item.to)"
          class="flex items-center gap-3 rounded-full px-5 py-3 bg-primary text-white shadow-lg shadow-primary/25 text-base font-semibold font-display"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span>{{ item.label }}</span>
        </div>
        <!-- Inactive circle -->
        <div
          v-else
          class="flex items-center gap-3 rounded-full px-3 py-3 h-12 bg-sidebar border border-sidebar-border text-muted-foreground group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all duration-200"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span class="hidden group-hover:inline text-base font-semibold font-display text-white whitespace-nowrap">{{ item.label }}</span>
        </div>
      </NuxtLink>

      <!-- Divider -->
      <div class="w-px h-4 bg-border self-center opacity-50" />

      <!-- Theme toggle -->
      <button
        class="group flex items-center gap-3 rounded-full px-3 py-3 h-12 bg-sidebar border border-sidebar-border text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-all duration-200"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" class="h-5 w-5 shrink-0" />
        <Moon v-else class="h-5 w-5 shrink-0" />
        <span class="hidden group-hover:inline text-base font-semibold font-display text-white whitespace-nowrap">{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>

      <!-- Back to site -->
      <NuxtLink
        to="/"
        class="group flex items-center gap-3 rounded-full px-3 py-3 h-12 bg-sidebar border border-sidebar-border text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-all duration-200"
        aria-label="Back to site"
      >
        <Home class="h-5 w-5 shrink-0" />
        <span class="hidden group-hover:inline text-base font-semibold font-display text-white whitespace-nowrap">Back to site</span>
      </NuxtLink>

      <!-- Logout -->
      <button
        class="group flex items-center gap-3 rounded-full px-3 py-3 h-12 bg-sidebar border border-sidebar-border text-muted-foreground hover:text-white hover:bg-destructive hover:border-destructive transition-all duration-200"
        aria-label="Logout"
        @click="auth.logout()"
      >
        <LogOut class="h-5 w-5 shrink-0" />
        <span class="hidden group-hover:inline text-base font-semibold font-display text-white whitespace-nowrap">Logout</span>
      </button>
    </nav>

    <!-- ── Main content ── -->
    <main class="relative z-10 lg:pl-24">
      <div class="container mx-auto px-8 max-w-5xl py-16 sm:py-20 pb-32 lg:pb-20">
        <slot />
      </div>
    </main>

    <!-- ── Mobile bottom bar ── -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-around bg-sidebar/90 backdrop-blur-lg border-t border-sidebar-border px-2 py-2"
      aria-label="Admin navigation"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200"
        :class="isActive(item.to) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </NuxtLink>

      <!-- Theme toggle mobile -->
      <button
        class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
        <span class="text-[10px] font-medium">Theme</span>
      </button>

      <!-- Logout mobile -->
      <button
        class="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-muted-foreground hover:text-destructive transition-all duration-200"
        @click="auth.logout()"
      >
        <LogOut class="h-5 w-5" />
        <span class="text-[10px] font-medium">Logout</span>
      </button>
    </nav>
  </div>
</template>
