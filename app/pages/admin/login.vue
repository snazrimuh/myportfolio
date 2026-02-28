<script setup lang="ts">
import { LogIn } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

definePageMeta({ layout: false })

const { initTheme } = useTheme()
const auth = useAuth()

const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  initTheme()
  if (auth.isLoggedIn.value) {
    const profile = await auth.fetchProfile()
    if (profile) { navigateTo('/admin'); return }
  }
})

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.email, form.password)
    navigateTo('/admin')
  } catch (e: any) {
    error.value = e?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground antialiased flex items-center justify-center px-8">
    <EffectsGradientBackground />

    <div class="relative z-10 w-full max-w-sm">
      <!-- Heading -->
      <div class="mb-10 text-center">
        <div class="inline-flex items-center gap-2 mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span class="text-xs font-medium text-primary uppercase tracking-widest">Portfolio Admin</span>
        </div>
        <h1 class="text-4xl font-bold font-display tracking-tight text-foreground leading-tight">
          Welcome<br />
          <span class="text-gradient">back.</span>
        </h1>
        <p class="mt-3 text-sm text-muted-foreground">Sign in to manage your portfolio content.</p>
      </div>

      <!-- Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Error -->
        <div
          v-if="error"
          class="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {{ error }}
        </div>

        <div class="space-y-1.5">
          <label for="email" class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="admin@example.com"
            required
            class="bg-background/60 border-border focus:border-primary/60 transition-colors rounded-xl h-11"
          />
        </div>

        <div class="space-y-1.5">
          <label for="password" class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="bg-background/60 border-border focus:border-primary/60 transition-colors rounded-xl h-11"
          />
        </div>

        <Button
          type="submit"
          class="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all hover:shadow-md hover:shadow-primary/20 font-semibold"
          :disabled="loading"
        >
          <LogIn class="mr-2 h-4 w-4" />
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </Button>
      </form>

      <!-- Back link -->
      <p class="mt-8 text-center text-xs text-muted-foreground">
        <NuxtLink to="/" class="hover:text-primary transition-colors">← Back to portfolio</NuxtLink>
      </p>
    </div>
  </div>
</template>
