<script setup lang="ts">
import { Plus, Pencil, Trash2, X, Save, ArrowLeft } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()

interface Experience {
  id: number
  title: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
  type: string
  order: number
}

const experiences = ref<Experience[]>([])
const showForm = ref(false)
const editing = ref<Experience | null>(null)
const loading = ref(false)

const typeOptions = ['WORK', 'INTERNSHIP', 'EDUCATION', 'CERTIFICATION']

const form = reactive({
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  type: 'INTERNSHIP',
  order: 0,
})

async function fetchExperiences() {
  experiences.value = await api.get<Experience[]>('/experiences')
}

function openCreate() {
  resetForm()
  editing.value = null
  showForm.value = true
}

function openEdit(exp: Experience) {
  editing.value = exp
  form.title = exp.title
  form.company = exp.company
  form.location = exp.location || ''
  form.startDate = exp.startDate ? exp.startDate.substring(0, 10) : ''
  form.endDate = exp.endDate ? exp.endDate.substring(0, 10) : ''
  form.description = exp.description || ''
  form.type = exp.type
  form.order = exp.order
  showForm.value = true
}

function resetForm() {
  form.title = ''
  form.company = ''
  form.location = ''
  form.startDate = ''
  form.endDate = ''
  form.description = ''
  form.type = 'INTERNSHIP'
  form.order = 0
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function typeBadgeVariant(type: string) {
  switch (type) {
    case 'WORK': return 'default'
    case 'INTERNSHIP': return 'secondary'
    case 'EDUCATION': return 'outline'
    default: return 'outline'
  }
}

async function handleSubmit() {
  loading.value = true
  const payload: Record<string, any> = {
    title: form.title,
    company: form.company,
    location: form.location || undefined,
    startDate: form.startDate,
    endDate: form.endDate || undefined,
    description: form.description || undefined,
    type: form.type,
    order: form.order,
  }

  try {
    if (editing.value) {
      await api.put(`/experiences/${editing.value.id}`, payload)
    } else {
      await api.post('/experiences', payload)
    }
    showForm.value = false
    await fetchExperiences()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('Delete this experience?')) return
  await api.del(`/experiences/${id}`)
  await fetchExperiences()
}

onMounted(fetchExperiences)
</script>

<template>
  <div>
    <div class="mb-6 space-y-3">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft class="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </NuxtLink>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold font-retro text-primary retro-glow">Experiences</h1>
        <Button @click="openCreate">
          <Plus class="mr-1 h-4 w-4" /> Add Experience
        </Button>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>{{ editing ? 'Edit' : 'New' }} Experience</CardTitle>
          <Button variant="ghost" size="sm" @click="showForm = false">
            <X class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label class="text-sm font-medium">Title / Position</label>
              <Input v-model="form.title" placeholder="e.g. Backend Developer Intern" required />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">Company / Institution</label>
                <Input v-model="form.company" placeholder="e.g. AirNav Indonesia" required />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Location</label>
                <Input v-model="form.location" placeholder="e.g. Tangerang, Indonesia" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">Start Date</label>
                <Input v-model="form.startDate" type="date" required />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">End Date (blank = present)</label>
                <Input v-model="form.endDate" type="date" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Type</label>
              <select
                v-model="form.type"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Description</label>
              <Textarea v-model="form.description" placeholder="Brief description..." class="min-h-20" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Order</label>
              <Input v-model.number="form.order" type="number" />
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" @click="showForm = false">Cancel</Button>
              <Button type="submit" :disabled="loading">
                <Save class="mr-1 h-4 w-4" />
                {{ loading ? 'Saving...' : 'Save' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Experiences table -->
    <Card class="border-primary/20">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-left text-muted-foreground">
                <th class="p-3">#</th>
                <th class="p-3">Title</th>
                <th class="p-3 hidden md:table-cell">Company</th>
                <th class="p-3 hidden lg:table-cell">Period</th>
                <th class="p-3 hidden sm:table-cell">Type</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="exp in experiences"
                :key="exp.id"
                class="border-b border-border/50 hover:bg-muted/30"
              >
                <td class="p-3 text-muted-foreground">{{ exp.order }}</td>
                <td class="p-3 font-medium">{{ exp.title }}</td>
                <td class="p-3 hidden md:table-cell text-muted-foreground">{{ exp.company }}</td>
                <td class="p-3 hidden lg:table-cell text-muted-foreground">
                  {{ formatDate(exp.startDate) }} — {{ formatDate(exp.endDate) }}
                </td>
                <td class="p-3 hidden sm:table-cell">
                  <Badge :variant="typeBadgeVariant(exp.type)" class="text-xs">
                    {{ exp.type }}
                  </Badge>
                </td>
                <td class="p-3 text-right">
                  <div class="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" @click="openEdit(exp)">
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" class="text-destructive" @click="handleDelete(exp.id)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="!experiences.length">
                <td colspan="6" class="p-8 text-center text-muted-foreground">No experiences yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
