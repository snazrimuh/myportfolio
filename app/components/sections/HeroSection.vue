<script setup lang="ts">
import { Github, Linkedin, Mail, Twitter, Instagram, ArrowDown, Download } from 'lucide-vue-next'

const { data: profile } = useProfile()
const { fetchExperiences, fetchProjects, fetchSkills } = usePublicApi()

const experienceCount = ref(0)
const projectCount = ref(0)
const skillCount = ref(0)

onMounted(async () => {
  try {
    const [experiences, projects, skills] = await Promise.all([
      fetchExperiences(),
      fetchProjects(),
      fetchSkills(),
    ])
    experienceCount.value = experiences.filter(e => e.type === 'INTERNSHIP').length
    projectCount.value = projects.length
    skillCount.value = skills.length
  } catch {}
})

// CV URL: absolute https://... dipakai langsung; path relatif /... diserve Nuxt/Vercel frontend.
const cvUrl = computed(() => {
  const url = profile.value?.resumeUrl
  if (!url) return null
  return url // bisa /cv.pdf atau https://...
})

// Typewriter state
const roles = computed(() => profile.value?.roles ?? ['Developer'])
const currentRoleIndex = ref(0)
const displayedRole = ref(roles.value[0] ?? '')
const isDeleting = ref(false)
const charIndex = ref(displayedRole.value.length)

watch(roles, (newRoles) => {
  displayedRole.value = newRoles[0] ?? ''
  charIndex.value = displayedRole.value.length
  currentRoleIndex.value = 0
  isDeleting.value = false
}, { once: true })

const socials = computed(() => {
  const p = profile.value
  if (!p) return []
  return [
    p.githubUrl    && { icon: Github,    label: 'GitHub',    href: p.githubUrl },
    p.linkedinUrl  && { icon: Linkedin,  label: 'LinkedIn',  href: p.linkedinUrl },
    p.email        && { icon: Mail,      label: 'Email',     href: `mailto:${p.email}` },
    p.twitterUrl   && { icon: Twitter,   label: 'Twitter',   href: p.twitterUrl },
    p.instagramUrl && { icon: Instagram, label: 'Instagram', href: p.instagramUrl },
  ].filter(Boolean) as { icon: any; label: string; href: string }[]
})

onMounted(() => {
  let timeout: ReturnType<typeof setTimeout>
  function tick() {
    const role = roles.value[currentRoleIndex.value] ?? ''
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
        currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.value.length
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

    <div class="relative z-10 container mx-auto px-8 max-w-6xl h-screen flex flex-col lg:flex-row items-center pb-16 pt-40 lg:pt-20">

      <!-- Left column: text content -->
      <div class="flex-1 flex flex-col justify-center lg:py-16 relative z-20">

        <!-- Open to work badge -->
        <div v-if="profile?.openToWork" class="inline-flex items-center gap-2 mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Open to work</span>
        </div>

        <!-- Name -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">
          {{ profile?.nameFirst }}<br />
          <span class="text-gradient">{{ profile?.nameSecond }}</span>
        </h1>

        <!-- Typewriter role -->
        <p class="text-xl sm:text-2xl text-muted-foreground mb-6 font-display">
          I'm
          <span class="text-foreground font-semibold border-b-2 border-primary pb-0.5">
            {{ displayedRole }}<span class="animate-pulse">|</span>
          </span>
        </p>

        <!-- Short bio/tagline -->
        <p class="text-base text-muted-foreground max-w-xl leading-relaxed mb-8 whitespace-pre-line">
          {{ profile?.tagline }}
        </p>

        <!-- Social links -->
        <div class="flex flex-wrap items-center gap-3">
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

          <!-- Download CV button -->
          <a
            v-if="cvUrl"
            :href="cvUrl"
            target="_blank"
            rel="noopener noreferrer"
            download
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 hover:shadow-sm transition-all duration-200"
          >
            <Download class="h-4 w-4" />
            Download CV
          </a>
        </div>

        <!-- Stats -->
        <div class="flex gap-8 mt-10">
          <div>
            <p class="text-2xl font-bold font-display text-foreground">
              <EffectsCountUp :target="experienceCount" :duration="1800" suffix="+" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Experience</p>
          </div>
          <div>
            <p class="text-2xl font-bold font-display text-foreground">
              <EffectsCountUp :target="projectCount" :duration="1800" suffix="+" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Projects</p>
          </div>
          <div>
            <p class="text-2xl font-bold font-display text-foreground">
              <EffectsCountUp :target="skillCount" :duration="1800" suffix="+" />
            </p>
            <p class="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Skills</p>
          </div>
        </div>

      </div>

      <!-- Right column: profile photo -->
      <div class="absolute lg:relative -bottom-32 lg:bottom-auto right-0 lg:flex lg:items-center lg:self-stretch w-screen lg:w-96 xl:w-[28rem] lg:flex-shrink-0 h-96 lg:h-full lg:overflow-hidden overflow-visible pointer-events-none lg:pointer-events-auto">
        <img
          src="/me.png"
          alt="Profile Photo"
          class="absolute right-0 bottom-0 lg:w-full lg:object-contain lg:object-center select-none pointer-events-none opacity-30 lg:opacity-90 transition-opacity duration-500"
          style="width: 75%; max-height: 120%; object-fit: contain; object-position: bottom right; filter: blur(0.5px);"
        />
        <!-- Gradient vignette - blends edges -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-background/60 z-[8]" />
        <!-- Left soft fade (desktop) -->
        <div class="hidden lg:block absolute inset-y-0 left-0 w-40 z-[7] pointer-events-none" style="background: linear-gradient(to right, var(--background, #0a0e27) 0%, rgba(10, 14, 39, 0.8) 40%, transparent 100%);" />
        <!-- Bottom soft fade (desktop) -->
        <div class="hidden lg:block absolute bottom-0 left-0 right-0 h-32 z-[7] pointer-events-none" style="background: linear-gradient(to top, var(--background, #0a0e27) 0%, rgba(10, 14, 39, 0.6) 40%, transparent 100%);" />
        <!-- Top fade - simple transparent gradient -->
        <div class="hidden lg:block absolute top-0 left-0 right-0 h-48 z-[7] pointer-events-none" style="background: linear-gradient(to bottom, var(--background, #0a0e27), transparent);" />
        <!-- Soft halo glow (desktop) -->
        <div class="hidden lg:block absolute inset-0 z-[6] pointer-events-none" style="background: radial-gradient(ellipse 120% 80% at 55% 45%, color-mix(in srgb, var(--color-primary, #3b82f6) 8%, transparent) 0%, transparent 60%);" />
        <!-- Secondary glow for more depth -->
        <div class="hidden lg:block absolute inset-0 z-[5] pointer-events-none" style="background: radial-gradient(circle at 60% 50%, color-mix(in srgb, var(--color-primary, #3b82f6) 5%, transparent) 0%, transparent 50%);" />
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
