<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const socials = [
  { icon: Github,   label: 'GitHub',   href: 'https://github.com/snazrimuh' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/syahrizannazri/' },
  { icon: Mail,     label: 'Email',    href: 'mailto:snazrimuh@gmail.com' },
]
</script>

<template>
  <!-- Extra bottom padding on mobile so the bottom nav bar doesn't overlap -->
  <footer class="border-t border-border bg-background py-8 mb-16 lg:mb-0">
    <div class="container mx-auto px-8 max-w-5xl">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">

        <p class="text-sm font-bold font-display tracking-tight text-foreground/70">SNRM</p>

        <div class="flex items-center gap-2">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
          >
            <component :is="social.icon" class="h-3.5 w-3.5" />
          </a>
        </div>

        <p class="text-xs text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} Syah Rizan Nazri Muhammad
          <NuxtLink to="/admin" class="opacity-10 hover:opacity-5" aria-label="admin" tabindex="-1">.</NuxtLink>
        </p>

      </div>
    </div>
  </footer>
</template>

