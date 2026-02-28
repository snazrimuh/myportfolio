<script setup lang="ts">
const { data: profile } = await useProfile()

useHead({
  title: profile.value?.siteTitle || 'Portfolio',
  meta: [
    { name: 'description', content: profile.value?.siteDescription || '' },
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
