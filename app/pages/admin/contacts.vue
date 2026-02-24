<script setup lang="ts">
import { Trash2, MailOpen, Mail, ArrowLeft } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const api = useApi()

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

const messages = ref<ContactMessage[]>([])
const selectedMessage = ref<ContactMessage | null>(null)

async function fetchMessages() {
  messages.value = await api.get<ContactMessage[]>('/contacts')
}

async function markAsRead(msg: ContactMessage) {
  if (!msg.read) {
    await api.patch(`/contacts/${msg.id}/read`)
    msg.read = true
  }
  selectedMessage.value = msg
}

async function handleDelete(id: number) {
  if (!confirm('Delete this message?')) return
  await api.del(`/contacts/${id}`)
  if (selectedMessage.value?.id === id) {
    selectedMessage.value = null
  }
  await fetchMessages()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)

onMounted(fetchMessages)
</script>

<template>
  <div>
    <div class="mb-6 space-y-3">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group">
        <ArrowLeft class="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </NuxtLink>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold font-retro text-primary retro-glow">Messages</h1>
          <Badge v-if="unreadCount" variant="default" class="text-xs">
            {{ unreadCount }} unread
          </Badge>
        </div>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <!-- Messages list -->
      <Card class="border-primary/20 lg:col-span-1">
        <CardContent class="p-0">
          <div class="divide-y divide-border/50 max-h-[70vh] overflow-y-auto">
            <div
              v-for="msg in messages"
              :key="msg.id"
              :class="[
                'flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-muted/30',
                selectedMessage?.id === msg.id && 'bg-primary/10',
                !msg.read && 'border-l-2 border-l-primary',
              ]"
              @click="markAsRead(msg)"
            >
              <component
                :is="msg.read ? MailOpen : Mail"
                :class="['mt-1 h-4 w-4 shrink-0', msg.read ? 'text-muted-foreground' : 'text-primary']"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p :class="['text-sm truncate', !msg.read && 'font-semibold']">
                    {{ msg.name }}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="shrink-0 text-destructive h-6 w-6 p-0"
                    @click.stop="handleDelete(msg.id)"
                  >
                    <Trash2 class="h-3 w-3" />
                  </Button>
                </div>
                <p class="text-xs text-muted-foreground truncate">{{ msg.email }}</p>
                <p class="text-xs text-muted-foreground mt-1 line-clamp-1">{{ msg.message }}</p>
              </div>
            </div>

            <div v-if="!messages.length" class="p-8 text-center text-muted-foreground">
              No messages yet
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Message detail -->
      <Card class="border-primary/20 lg:col-span-2">
        <template v-if="selectedMessage">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle>{{ selectedMessage.name }}</CardTitle>
                <CardDescription>
                  {{ selectedMessage.email }} · {{ formatDate(selectedMessage.createdAt) }}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="text-destructive"
                @click="handleDelete(selectedMessage.id)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p class="whitespace-pre-wrap text-foreground leading-relaxed">
              {{ selectedMessage.message }}
            </p>
          </CardContent>
        </template>
        <template v-else>
          <CardContent class="flex items-center justify-center h-64">
            <p class="text-muted-foreground">Select a message to read</p>
          </CardContent>
        </template>
      </Card>
    </div>
  </div>
</template>
