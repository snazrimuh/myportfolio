<script setup lang="ts">
import { Plus, Pencil, Trash2, X, Save, ExternalLink, ArrowLeft } from 'lucide-vue-next'
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

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  category: 'BACKEND' | 'FULLSTACK' | 'MOBILE' | 'ML_DL'
  github?: string
  liveUrl?: string
  image?: string
  featured: boolean
  order: number
}

const projects = ref<Project[]>([])
const showForm = ref(false)
const editing = ref<Project | null>(null)
const loading = ref(false)

const form = reactive({
  title: '',
  description: '',
  techInput: '',
  tech: [] as string[],
  category: 'FULLSTACK' as 'BACKEND' | 'FULLSTACK' | 'MOBILE' | 'ML_DL',
  github: '',
  liveUrl: '',
  image: '',
  featured: false,
  order: 0,
})

async function fetchProjects() {
  projects.value = await api.get<Project[]>('/projects')
}

function openCreate() {
  resetForm()
  editing.value = null
  showForm.value = true
}

function openEdit(project: Project) {
  editing.value = project
  form.title = project.title
  form.description = project.description
  form.tech = [...project.tech]
  form.techInput = ''
  form.category = project.category
  form.github = project.github || ''
  form.liveUrl = project.liveUrl || ''
  form.image = project.image || ''
  form.featured = project.featured
  form.order = project.order
  showForm.value = true
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.techInput = ''
  form.tech = []
  form.category = 'FULLSTACK'
  form.github = ''
  form.liveUrl = ''
  form.image = ''
  form.featured = false
  form.order = 0
}

function addTech() {
  const tag = form.techInput.trim()
  if (tag && !form.tech.includes(tag)) {
    form.tech.push(tag)
  }
  form.techInput = ''
}

function removeTech(index: number) {
  form.tech.splice(index, 1)
}

async function handleSubmit() {
  loading.value = true
  const payload = {
    title: form.title,
    description: form.description,
    tech: form.tech,
    category: form.category,
    github: form.github || undefined,
    liveUrl: form.liveUrl || undefined,
    image: form.image || undefined,
    featured: form.featured,
    order: form.order,
  }

  try {
    if (editing.value) {
      await api.put(`/projects/${editing.value.id}`, payload)
    } else {
      await api.post('/projects', payload)
    }
    showForm.value = false
    await fetchProjects()
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to save project')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: number) {
  if (!confirm('Delete this project?')) return
  await api.del(`/projects/${id}`)
  await fetchProjects()
}

onMounted(fetchProjects)
</script>

<template>
  <div>
    <div class="mb-6 space-y-3">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft class="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </NuxtLink>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold font-retro text-primary retro-glow">Projects</h1>
        <Button @click="openCreate">
          <Plus class="mr-1 h-4 w-4" /> Add Project
        </Button>
      </div>
    </div>

    <!-- Form modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30">
        <CardHeader class="flex flex-row items-center justify-between">
          <CardTitle>{{ editing ? 'Edit' : 'New' }} Project</CardTitle>
          <Button variant="ghost" size="sm" @click="showForm = false">
            <X class="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <label class="text-sm font-medium">Title</label>
              <Input v-model="form.title" placeholder="Project title" required />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Category</label>
              <select v-model="form.category" class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="BACKEND">Backend</option>
                <option value="FULLSTACK">Fullstack</option>
                <option value="MOBILE">Mobile</option>
                <option value="ML_DL">ML / DL</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Description</label>
              <Textarea v-model="form.description" placeholder="Project description..." class="min-h-24" required />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Tech Stack</label>
              <div class="flex gap-2">
                <Input
                  v-model="form.techInput"
                  placeholder="Add technology..."
                  @keydown.enter.prevent="addTech"
                />
                <Button type="button" variant="outline" @click="addTech">Add</Button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <Badge
                  v-for="(tag, i) in form.tech"
                  :key="tag"
                  variant="secondary"
                  class="cursor-pointer hover:bg-destructive/20"
                  @click="removeTech(i)"
                >
                  {{ tag }} ×
                </Badge>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">GitHub URL</label>
                <Input v-model="form.github" placeholder="https://github.com/..." />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Live URL</label>
                <Input v-model="form.liveUrl" placeholder="https://..." />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Image Path</label>
              <Input v-model="form.image" placeholder="/project-image.png" />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">Order</label>
                <Input v-model.number="form.order" type="number" />
              </div>
              <div class="flex items-center gap-2 pt-6">
                <input id="featured" v-model="form.featured" type="checkbox" class="accent-primary" />
                <label for="featured" class="text-sm font-medium">Featured</label>
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

    <!-- Projects table -->
    <Card class="border-primary/20">
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border text-left text-muted-foreground">
                <th class="p-3">#</th>
                <th class="p-3">Title</th>
                <th class="p-3 hidden sm:table-cell">Category</th>
                <th class="p-3 hidden md:table-cell">Tech</th>
                <th class="p-3 hidden sm:table-cell">Featured</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="project in projects"
                :key="project.id"
                class="border-b border-border/50 hover:bg-muted/30"
              >
                <td class="p-3 text-muted-foreground">{{ project.order }}</td>
                <td class="p-3 font-medium">
                  {{ project.title }}
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    class="ml-1 inline-block"
                  >
                    <ExternalLink class="h-3 w-3 text-muted-foreground" />
                  </a>
                </td>
                <td class="p-3 hidden sm:table-cell">
                  <Badge
                    :class="{
                      'bg-emerald-500/10 text-emerald-600 border-0': project.category === 'BACKEND',
                      'bg-blue-500/10 text-blue-600 border-0': project.category === 'FULLSTACK',
                      'bg-violet-500/10 text-violet-600 border-0': project.category === 'MOBILE',
                      'bg-amber-500/10 text-amber-600 border-0': project.category === 'ML_DL',
                    }"
                    variant="secondary"
                  >
                    {{ { BACKEND: 'Backend', FULLSTACK: 'Fullstack', MOBILE: 'Mobile', ML_DL: 'ML / DL' }[project.category] }}
                  </Badge>
                </td>
                <td class="p-3 hidden md:table-cell">
                  <div class="flex flex-wrap gap-1">
                    <Badge v-for="t in project.tech" :key="t" variant="outline" class="text-xs">
                      {{ t }}
                    </Badge>
                  </div>
                </td>
                <td class="p-3 hidden sm:table-cell">
                  <Badge :variant="project.featured ? 'default' : 'secondary'">
                    {{ project.featured ? 'Yes' : 'No' }}
                  </Badge>
                </td>
                <td class="p-3 text-right">
                  <div class="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" @click="openEdit(project)">
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" class="text-destructive" @click="handleDelete(project.id)">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="!projects.length">
                <td colspan="6" class="p-8 text-center text-muted-foreground">No projects yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
