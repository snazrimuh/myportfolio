<script setup lang="ts">
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const { sendContactMessage } = usePublicApi()

const form = reactive({ name: '', email: '', message: '' })
const sending = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | ''>('')

async function handleSubmit() {
  sending.value = true
  statusMessage.value = ''
  statusType.value = ''
  try {
    await sendContactMessage({ ...form })
    statusMessage.value = "Thank you! I'll get back to you soon."
    statusType.value = 'success'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e: any) {
    statusMessage.value = 'Failed to send. Please try again later.'
    statusType.value = 'error'
  } finally {
    sending.value = false
  }
}

const contactLinks = [
  { icon: Mail,     label: 'snazrimuh@gmail.com',          href: 'mailto:snazrimuh@gmail.com' },
  { icon: Linkedin, label: 'linkedin.com/in/syahrizannazri', href: 'https://linkedin.com/in/syahrizannazri/' },
  { icon: Github,   label: 'github.com/snazrimuh',          href: 'https://github.com/snazrimuh' },
]
</script>

<template>
  <section id="contact" class="py-24 sm:py-32 bg-secondary/30">
    <div class="container mx-auto px-8 max-w-5xl">

      <!-- Section heading -->
      <div class="section-divider">
        <h2>Contact</h2>
      </div>

      <p class="text-center text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-14">
        I'm always open to discussing new projects, creative ideas, or opportunities. Feel free to reach out!
      </p>

      <div class="grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">

        <!-- Left: Contact info -->
        <div class="space-y-6">
          <div class="flex items-start gap-3">
            <MapPin class="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
            <div>
              <p class="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Location</p>
              <p class="text-sm font-medium text-foreground">Tangerang, Indonesia</p>
            </div>
          </div>

          <div
            v-for="link in contactLinks"
            :key="link.href"
            class="flex items-start gap-3"
          >
            <component :is="link.icon" class="h-4.5 w-4.5 text-primary mt-0.5 shrink-0" />
            <div>
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <form class="space-y-4 minimal-card rounded-2xl p-6 sm:p-8" @submit.prevent="handleSubmit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label for="name" class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name</label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="Your name"
                required
                class="bg-background border-border focus:border-primary/60 transition-colors rounded-xl"
              />
            </div>
            <div class="space-y-1.5">
              <label for="email" class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                required
                class="bg-background border-border focus:border-primary/60 transition-colors rounded-xl"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="message" class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</label>
            <Textarea
              id="message"
              v-model="form.message"
              placeholder="Tell me about your project or idea..."
              class="min-h-32 bg-background border-border focus:border-primary/60 transition-colors resize-none rounded-xl"
              required
            />
          </div>

          <p
            v-if="statusMessage"
            :class="['text-sm', statusType === 'success' ? 'text-emerald-500' : 'text-red-500']"
          >
            {{ statusMessage }}
          </p>

          <Button
            type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-white rounded-xl transition-all hover:shadow-md hover:shadow-primary/20"
            :disabled="sending"
          >
            <Send class="mr-2 h-3.5 w-3.5" />
            {{ sending ? 'Sending...' : 'Send Message' }}
          </Button>
        </form>

      </div>
    </div>
  </section>
</template>

