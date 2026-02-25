<script setup lang="ts">
import { Github, Linkedin, Mail, Twitter, Instagram, Facebook, ArrowDown } from 'lucide-vue-next'

const roles = ['Backend Developer', 'Fullstack Engineer', 'API Designer']
const currentRoleIndex = ref(0)
const displayedRole = ref(roles[0]!)
const isDeleting = ref(false)
const charIndex = ref(roles[0]!.length)

const socials = [
  { icon: Github,    label: 'GitHub',    href: 'https://github.com/snazrimuh' },
  { icon: Linkedin,  label: 'LinkedIn',  href: 'https://linkedin.com/in/syahrizannazri/' },
  { icon: Mail,      label: 'Email',     href: 'mailto:snazrimuh@gmail.com' },
]

onMounted(() => {
  let timeout: ReturnType<typeof setTimeout>
  function tick() {
    const role = roles[currentRoleIndex.value]!
    if (!isDeleting.value) {
      if (charIndex.value < role.length) {
        charIndex.value++
        displayedRole.value = role.slice(0, charIndex.value)
        timeout = setTimeout(tick, 90)
      } else {
        timeout = setTimeout(() => { isDeleting.value = true; tick() }, 1800)
      }
    } else {
      if (charIndex.value > 0) {
        charIndex.value--
        displayedRole.value = role.slice(0, charIndex.value)
        timeout = setTimeout(tick, 45)
      } else {
        isDeleting.value = false
        currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
        timeout = setTimeout(tick, 300)
      }
    }
  }
  timeout = setTimeout(tick, 1200)
  onUnmounted(() => clearTimeout(timeout))
})
</script>

<template>
  <section id="hero" class="relative min-h-screen overflow-hidden bg-background">
    <!-- Background subtle gradient -->  
    <div class="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30 pointer-events-none" />
    <!-- Decorative blobs -->
    <div class="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute bottom-40 left-20 w-64 h-64 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

    <div class="relative z-10 container mx-auto px-8 max-w-5xl h-screen flex flex-col justify-center pb-24 lg:pb-16 pt-20 lg:pt-0">

      <!-- Open to work badge -->
      <div class="inline-flex items-center gap-2 mb-6">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Open to work</span>
      </div>

      <!-- Name -->
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">
        Syah Rizan<br />
        <span class="text-gradient">Nazri Muhammad</span>
      </h1>

      <!-- Typewriter role -->
      <p class="text-xl sm:text-2xl text-muted-foreground mb-6 font-display">
        I'm
        <span class="text-foreground font-semibold border-b-2 border-primary pb-0.5">
          {{ displayedRole }}<span class="animate-pulse">|</span>
        </span>
      </p>

      <!-- Short bio -->
      <p class="text-base text-muted-foreground max-w-xl leading-relaxed mb-8">
        Software Engineer specializing in scalable backend systems, API architecture, and fullstack engineering for impactful products.
        <br>Based in Tangerang City, Indonesia.
      </p>

      <!-- Social links -->
      <div class="flex items-center gap-3">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          :aria-label="s.label"
          target="_blank"
          rel="noopener noreferrer"
          class="w-11 h-11 rounded-full flex items-center justify-center border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-sm transition-all duration-200"
        >
          <component :is="s.icon" class="h-4.5 w-4.5" />
        </a>
      </div>
    </div>

    <!-- Scroll hint -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <button
        class="flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-primary transition-colors duration-200"
        aria-label="Scroll down"
        @click="$el.closest('section')?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })"
      >
        <ArrowDown class="h-4 w-4 animate-bounce" />
      </button>
    </div>
  </section>
</template>
