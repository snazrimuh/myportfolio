<script setup lang="ts">
useHead({
  title: 'Portfolio — Syah Rizan Nazri Muhammad',
  meta: [
    { name: 'description', content: 'Software Engineer with experience in backend development, API design, database management, and fullstack engineering for impactful products.' },
  ],
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground antialiased">
    <ScrollProgress />
    <NuxtRouteAnnouncer />
    <Navbar />

    <!-- Main content: offset left on desktop to clear the sidebar -->
    <main class="lg:pl-24">
      <SectionsHeroSection />
      <SectionsAboutSection />
      <SectionsResumeSection />
      <SectionsProjectsSection />
      <SectionsSkillsSection />
      <SectionsContactSection />
    </main>

    <FooterSection />
  </div>
</template>
