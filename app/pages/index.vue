<script setup lang="ts">
useHead({
  title: 'Portfolio — Syah Rizan Nazri Muhammad',
  meta: [
    { name: 'description', content: 'Fresh graduate with experience in backend development, API design, database management, and IoT-based solutions.' },
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
      <SectionsProjectsSection />
      <SectionsSkillsSection />
      <SectionsContactSection />
    </main>

    <FooterSection />
  </div>
</template>
