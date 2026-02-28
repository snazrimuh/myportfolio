<script setup lang="ts">
import { Save, Plus, Trash2, User, Link2, AlignLeft, Settings2, Type } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import type { AboutCard } from '~/composables/usePublicApi'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()
const saving = ref(false)
const saveMessage = ref('')
const saveType = ref<'success' | 'error' | ''>('')

// ── Form state ───────────────────────────────────────────
const form = reactive({
  nameFirst: '',
  nameSecond: '',
  roles: [] as string[],
  newRole: '',
  tagline: '',
  bio: '',
  location: '',
  email: '',
  degree: '',
  freelanceAvailable: true,
  openToWork: true,
  resumeUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  instagramUrl: '',
  siteTitle: '',
  siteDescription: '',
  aboutCards: [] as AboutCard[],
  skillsTagline: '',
  resumeTagline: '',
  projectsTagline: '',
  contactIntro: '',
})

// ── Load current profile ─────────────────────────────────
onMounted(async () => {
  try {
    const profile = await api.get<any>('/profile')
    form.nameFirst = profile.nameFirst ?? ''
    form.nameSecond = profile.nameSecond ?? ''
    form.roles = Array.isArray(profile.roles) ? [...profile.roles] : []
    form.tagline = profile.tagline ?? ''
    form.bio = profile.bio ?? ''
    form.location = profile.location ?? ''
    form.email = profile.email ?? ''
    form.degree = profile.degree ?? ''
    form.freelanceAvailable = profile.freelanceAvailable ?? true
    form.openToWork = profile.openToWork ?? true
    form.resumeUrl = profile.resumeUrl ?? ''
    form.githubUrl = profile.githubUrl ?? ''
    form.linkedinUrl = profile.linkedinUrl ?? ''
    form.twitterUrl = profile.twitterUrl ?? ''
    form.instagramUrl = profile.instagramUrl ?? ''
    form.siteTitle = profile.siteTitle ?? ''
    form.siteDescription = profile.siteDescription ?? ''
    form.aboutCards = Array.isArray(profile.aboutCards) ? JSON.parse(JSON.stringify(profile.aboutCards)) : []
    form.skillsTagline = profile.skillsTagline ?? ''
    form.resumeTagline = profile.resumeTagline ?? ''
    form.projectsTagline = profile.projectsTagline ?? ''
    form.contactIntro = profile.contactIntro ?? ''
  } catch (e) {
    console.error('Failed to load profile', e)
  }
})

// ── Roles helpers ────────────────────────────────────────
function addRole() {
  const r = form.newRole.trim()
  if (r && !form.roles.includes(r)) {
    form.roles.push(r)
    form.newRole = ''
  }
}
function removeRole(index: number) {
  form.roles.splice(index, 1)
}

// ── About cards helpers ──────────────────────────────────
function addCard() {
  form.aboutCards.push({ title: '', description: '' })
}
function removeCard(index: number) {
  form.aboutCards.splice(index, 1)
}

// ── Save ─────────────────────────────────────────────────
async function save() {
  saving.value = true
  saveMessage.value = ''
  saveType.value = ''
  try {
    const { newRole: _, ...payload } = form
    await api.put('/profile', {
      ...payload,
      resumeUrl:    payload.resumeUrl    || null,
      githubUrl:    payload.githubUrl    || null,
      linkedinUrl:  payload.linkedinUrl  || null,
      twitterUrl:   payload.twitterUrl   || null,
      instagramUrl: payload.instagramUrl || null,
    })
    saveMessage.value = 'Profile saved successfully.'
    saveType.value = 'success'
  } catch (e: any) {
    saveMessage.value = 'Failed to save profile. Please try again.'
    saveType.value = 'error'
  } finally {
    saving.value = false
    setTimeout(() => { saveMessage.value = ''; saveType.value = '' }, 4000)
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold font-display text-foreground">Profile</h1>
        <p class="text-sm text-muted-foreground mt-1">Manage all portfolio content — name, bio, links, and section taglines.</p>
      </div>
      <div class="flex items-center gap-3">
        <p v-if="saveMessage" :class="['text-sm font-medium', saveType === 'success' ? 'text-emerald-400' : 'text-red-400']">
          {{ saveMessage }}
        </p>
        <Button :disabled="saving" @click="save">
          <Save class="h-4 w-4 mr-2" />
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </Button>
      </div>
    </div>

    <div class="space-y-6">

      <!-- ── Identity ───────────────────────────────────── -->
      <div class="minimal-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-border/50">
          <p class="text-sm font-semibold flex items-center gap-2">
            <User class="h-4 w-4 text-primary" />
            Identity
          </p>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name (first line)</label>
              <Input v-model="form.nameFirst" placeholder="e.g. Syah Rizan" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Name (gradient line)</label>
              <Input v-model="form.nameSecond" placeholder="e.g. Nazri Muhammad" />
            </div>
          </div>

          <!-- Typewriter roles -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Typewriter Roles</label>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(role, i) in form.roles"
                :key="i"
                class="flex items-center gap-1.5 bg-primary/10 border border-primary/30 rounded-full px-3 py-1 text-sm"
              >
                <span class="text-foreground">{{ role }}</span>
                <button type="button" class="text-muted-foreground hover:text-red-400 transition-colors" @click="removeRole(i)">
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>
            </div>
            <div class="flex gap-2">
              <Input
                v-model="form.newRole"
                placeholder="Add a role…"
                class="max-w-xs"
                @keydown.enter.prevent="addRole"
              />
              <Button type="button" variant="outline" size="sm" @click="addRole">
                <Plus class="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hero Tagline</label>
            <Textarea v-model="form.tagline" placeholder="Short bio shown below the typewriter in the hero section." class="min-h-20 resize-none" />
          </div>

          <!-- Open to work / freelance flags -->
          <div class="flex flex-wrap gap-6">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input v-model="form.openToWork" type="checkbox" class="accent-primary h-4 w-4" />
              <span class="text-sm text-foreground">Show "Open to work" badge</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input v-model="form.freelanceAvailable" type="checkbox" class="accent-primary h-4 w-4" />
              <span class="text-sm text-foreground">Available for freelance</span>
            </label>
          </div>
        </div>
      </div>

      <!-- ── About ──────────────────────────────────────── -->
      <div class="minimal-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-border/50">
          <p class="text-sm font-semibold flex items-center gap-2">
            <AlignLeft class="h-4 w-4 text-primary" />
            About
          </p>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bio</label>
            <Textarea v-model="form.bio" placeholder="Full biography displayed in the About section." class="min-h-36 resize-none" />
          </div>

          <!-- Info fields -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</label>
              <Input v-model="form.location" placeholder="e.g. Tangerang City, Indonesia" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Degree</label>
              <Input v-model="form.degree" placeholder="e.g. S1 Informatics" />
            </div>
          </div>

          <!-- About cards -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role Cards</label>
              <Button type="button" variant="outline" size="sm" @click="addCard">
                <Plus class="h-4 w-4 mr-1" /> Add Card
              </Button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(card, i) in form.aboutCards"
                :key="i"
                class="minimal-card rounded-xl p-4 space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs text-muted-foreground font-semibold uppercase">Card {{ i + 1 }}</span>
                  <button type="button" class="text-muted-foreground hover:text-red-400 transition-colors" @click="removeCard(i)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
                <Input v-model="card.title" placeholder="Card title" />
                <Textarea v-model="card.description" placeholder="Card description" class="min-h-20 resize-none" />
              </div>
              <p v-if="!form.aboutCards.length" class="text-sm text-muted-foreground text-center py-4">
                No cards yet — click "Add Card" to create one.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Contact Info ──────────────────────────────── -->
      <div class="minimal-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-border/50">
          <p class="text-sm font-semibold flex items-center gap-2">
            <Link2 class="h-4 w-4 text-primary" />
            Contact &amp; Links
          </p>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <Input v-model="form.email" type="email" placeholder="you@example.com" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resume URL</label>
              <Input v-model="form.resumeUrl" placeholder="https://…" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">GitHub URL</label>
              <Input v-model="form.githubUrl" placeholder="https://github.com/…" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">LinkedIn URL</label>
              <Input v-model="form.linkedinUrl" placeholder="https://linkedin.com/in/…" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Twitter / X URL</label>
              <Input v-model="form.twitterUrl" placeholder="https://twitter.com/…" />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Instagram URL</label>
              <Input v-model="form.instagramUrl" placeholder="https://instagram.com/…" />
            </div>
          </div>
        </div>
      </div>

      <!-- ── SEO / Site Meta ───────────────────────────── -->
      <div class="minimal-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-border/50">
          <p class="text-sm font-semibold flex items-center gap-2">
            <Settings2 class="h-4 w-4 text-primary" />
            SEO &amp; Site Meta
          </p>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Site Title</label>
            <Input v-model="form.siteTitle" placeholder="Portfolio — Your Name" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Meta Description</label>
            <Textarea v-model="form.siteDescription" placeholder="Short description for search engines." class="min-h-20 resize-none" />
          </div>
        </div>
      </div>

      <!-- ── Section Taglines ──────────────────────────── -->
      <div class="minimal-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-border/50">
          <p class="text-sm font-semibold flex items-center gap-2">
            <Type class="h-4 w-4 text-primary" />
            Section Taglines
          </p>
        </div>
        <div class="p-5 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Skills Section</label>
            <Input v-model="form.skillsTagline" placeholder="Technologies and tools I use…" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Resume Section</label>
            <Input v-model="form.resumeTagline" placeholder="My professional journey…" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Projects Section</label>
            <Input v-model="form.projectsTagline" placeholder="A selection of projects I've built…" />
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Section Intro</label>
            <Textarea v-model="form.contactIntro" placeholder="I'm always open to discussing new projects…" class="min-h-20 resize-none" />
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom save bar -->
    <div class="mt-8 flex items-center justify-between rounded-xl border border-primary/20 bg-background/40 backdrop-blur-sm px-6 py-4">
      <p v-if="saveMessage" :class="['text-sm font-medium', saveType === 'success' ? 'text-emerald-400' : 'text-red-400']">
        {{ saveMessage }}
      </p>
      <p v-else class="text-sm text-muted-foreground">All changes are applied immediately on save.</p>
      <Button :disabled="saving" @click="save">
        <Save class="h-4 w-4 mr-2" />
        {{ saving ? 'Saving…' : 'Save Changes' }}
      </Button>
    </div>
  </div>
</template>
