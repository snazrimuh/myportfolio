<script setup lang="ts">
import { Plus, Pencil, Trash2, X, Save, ArrowLeft } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()

interface Skill {
  id: number
  name: string
}

interface SkillCategory {
  id: number
  name: string
  icon: string
  color: string
  order: number
  skills: Skill[]
}

const categories = ref<SkillCategory[]>([])
const showForm = ref(false)
const editing = ref<SkillCategory | null>(null)
const loading = ref(false)

const form = reactive({
  name: '',
  icon: '',
  color: '',
  order: 0,
  skillInput: '',
  skills: [] as string[],
})

const iconOptions = ['Monitor', 'Server', 'Database', 'Cpu', 'Brain', 'Wrench', 'Code', 'Globe', 'Shield', 'Zap']

async function fetchCategories() {
  categories.value = await api.get<SkillCategory[]>('/skills')
}

function openCreate() {
  resetForm()
  editing.value = null
  showForm.value = true
}

function openEdit(cat: SkillCategory) {
  editing.value = cat
  form.name = cat.name
  form.icon = cat.icon
  form.color = cat.color
  form.order = cat.order
  form.skills = cat.skills.map((s) => s.name)
  form.skillInput = ''
  showForm.value = true
}

function resetForm() {
  form.name = ''
  form.icon = 'Monitor'
  form.color = 'rgba(59, 130, 246, 0.1)'
  form.order = 0
  form.skillInput = ''
  form.skills = []
}

function addSkill() {
  const tag = form.skillInput.trim()
  if (tag && !form.skills.includes(tag)) {
    form.skills.push(tag)
  }
  form.skillInput = ''
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

async function handleSubmit() {
  loading.value = true
  const payload = {
    name: form.name,
    icon: form.icon,
    color: form.color,
    order: form.order,
    skills: form.skills,
  }

  try {
    if (editing.value) {
      await api.put(`/skills/${editing.value.id}`, payload)
    } else {
      await api.post('/skills', payload)
    }
    showForm.value = false
    await fetchCategories()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('Delete this skill category and all its skills?')) return
  await api.del(`/skills/${id}`)
  await fetchCategories()
}

onMounted(fetchCategories)
</script>

<template>
  <div>
    <div class="mb-6 space-y-3">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft class="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </NuxtLink>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold font-display text-foreground">Skills</h1>
        <Button @click="openCreate">
          <Plus class="mr-1 h-4 w-4" /> Add Category
        </Button>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto border-primary/30">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>{{ editing ? 'Edit' : 'New' }} Skill Category</CardTitle>
          <Button variant="ghost" size="sm" @click="showForm = false">
            <X class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label class="text-sm font-medium">Category Name</label>
              <Input v-model="form.name" placeholder="e.g. Frontend" required />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Icon Name</label>
              <select
                v-model="form.icon"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option v-for="icon in iconOptions" :key="icon" :value="icon">
                  {{ icon }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Color (rgba)</label>
              <Input v-model="form.color" placeholder="rgba(59, 130, 246, 0.1)" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Order</label>
              <Input v-model.number="form.order" type="number" />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Skills</label>
              <div class="flex gap-2">
                <Input
                  v-model="form.skillInput"
                  placeholder="Add skill..."
                  @keydown.enter.prevent="addSkill"
                />
                <Button type="button" variant="outline" @click="addSkill">Add</Button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <Badge
                  v-for="(skill, i) in form.skills"
                  :key="skill"
                  variant="secondary"
                  class="cursor-pointer hover:bg-destructive/20"
                  @click="removeSkill(i)"
                >
                  {{ skill }} ×
                </Badge>
              </div>
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

    <!-- Skill categories grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="cat in categories" :key="cat.id" class="minimal-card rounded-2xl p-5">
        <div class="flex flex-row items-center justify-between pb-2">
          <p class="text-base font-semibold font-display text-foreground">{{ cat.name }}</p>
          <div class="flex gap-1">
            <Button variant="ghost" size="sm" @click="openEdit(cat)">
              <Pencil class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" class="text-destructive" @click="handleDelete(cat.id)">
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div>
          <p class="text-xs text-muted-foreground mb-2">Icon: {{ cat.icon }} · Order: {{ cat.order }}</p>
          <div class="flex flex-wrap gap-1">
            <Badge v-for="skill in cat.skills" :key="skill.id" variant="outline" class="text-xs">
              {{ skill.name }}
            </Badge>
          </div>
        </div>
      </div>

      <div
        v-if="!categories.length"
        class="minimal-card rounded-2xl border-dashed flex items-center justify-center p-8 sm:col-span-2 lg:col-span-3"
      >
        <p class="text-muted-foreground">No skill categories yet</p>
      </div>
    </div>
  </div>
</template>
