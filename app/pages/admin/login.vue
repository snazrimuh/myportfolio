<script setup lang="ts">
import { LogIn } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

definePageMeta({ layout: false })

const auth = useAuth()

const form = reactive({
  email: '',
  password: '',
})
const error = ref('')
const loading = ref(false)

// Redirect if already logged in
onMounted(async () => {
  if (auth.isLoggedIn.value) {
    const profile = await auth.fetchProfile()
    if (profile) {
      navigateTo('/admin')
      return
    }
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
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <Card class="w-full max-w-md border-primary/30">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-retro text-primary retro-glow">
          Admin Login
        </CardTitle>
        <CardDescription>
          Sign in to manage your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div
            v-if="error"
            class="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {{ error }}
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium">Email</label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="email"
              required
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-sm font-medium">Password</label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <LogIn class="mr-2 h-4 w-4" />
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
