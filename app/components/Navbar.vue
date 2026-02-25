<script setup lang="ts">
import { Home, User, FolderOpen, Layers, Mail, Sun, Moon, FileText } from 'lucide-vue-next'

const { isDark, toggleTheme, initTheme } = useTheme()

const activeSection = ref('hero')

const navItems = [
  { id: 'hero',     label: 'Home',     icon: Home       },
  { id: 'about',    label: 'About',    icon: User       },
  { id: 'resume',   label: 'Resume',   icon: FileText   },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'skills',   label: 'Skills',   icon: Layers     },
  { id: 'contact',  label: 'Contact',  icon: Mail       },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  initTheme()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id
      })
    },
    { threshold: 0.4 }
  )

  navItems.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <!-- ── Desktop sidebar (vertical, left, centered) ── -->
  <nav
    class="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-start gap-3"
    aria-label="Site navigation"
  >
    <button
      v-for="item in navItems"
      :key="item.id"
      :aria-label="item.label"
      :aria-current="activeSection === item.id ? 'page' : undefined"
      class="group flex items-center gap-3 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      @click="scrollTo(item.id)"
    >
      <!-- Active pill -->
      <div
        v-if="activeSection === item.id"
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
    </button>

    <!-- Divider -->
    <div class="w-px h-4 bg-border self-center mx-auto opacity-50" />

    <!-- Theme toggle -->
    <button
      class="group flex items-center gap-3 rounded-full px-3 py-3 h-12 bg-sidebar border border-sidebar-border text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-all duration-200"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggleTheme"
    >
      <Sun v-if="isDark" class="h-5 w-5 shrink-0" />
      <Moon v-else class="h-5 w-5 shrink-0" />
      <span class="hidden hover:inline text-base font-semibold font-display text-white whitespace-nowrap">{{ isDark ? 'Light' : 'Dark' }}</span>
    </button>
  </nav>

  <!-- ── Mobile bottom bar ── -->
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-around bg-sidebar/90 backdrop-blur-lg border-t border-sidebar-border px-2 py-2"
    aria-label="Site navigation"
  >
    <button
      v-for="item in navItems"
      :key="item.id"
      :aria-label="item.label"
      :aria-current="activeSection === item.id ? 'page' : undefined"
      class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200"
      :class="activeSection === item.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      @click="scrollTo(item.id)"
    >
      <component :is="item.icon" class="h-5 w-5" />
      <span class="text-[10px] font-medium">{{ item.label }}</span>
    </button>

    <!-- Theme toggle mobile -->
    <button
      class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
      :aria-label="isDark ? 'Light mode' : 'Dark mode'"
      @click="toggleTheme"
    >
      <Sun v-if="isDark" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
      <span class="text-[10px] font-medium">Theme</span>
    </button>
  </nav>
</template>
