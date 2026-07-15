<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Eddyter } from '@eddyter/vue'
import { eddyterApiKey } from '../../config/eddyter'

const props = defineProps<{
  postId: string
}>()

const emit = defineEmits<{
  cancel: []
  hostLifecycle: [event: 'mounted' | 'destroyed']
}>()

const html = ref('<p></p>')
const lastSaved = ref<Date | null>(null)
let saveTimer: ReturnType<typeof setTimeout> | null = null

const draftKey = computed(() => `comments:draft:${props.postId}`)

const hasPreviewContent = computed(
  () => html.value.replace(/<[^>]*>/g, '').trim().length > 0,
)

function persist() {
  localStorage.setItem(draftKey.value, html.value)
  lastSaved.value = new Date()
}

function scheduleAutosave() {
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    persist()
    saveTimer = null
  }, 400)
}

watch(html, scheduleAutosave)

function logEditor(event: string, detail?: unknown) {
  if (detail !== undefined) {
    console.log(`[Reply:${props.postId}] editor:${event}`, detail)
  } else {
    console.log(`[Reply:${props.postId}] editor:${event}`)
  }
}

onMounted(() => {
  const saved = localStorage.getItem(draftKey.value)
  if (saved) html.value = saved
  emit('hostLifecycle', 'mounted')
})

onBeforeUnmount(() => {
  if (saveTimer !== null) clearTimeout(saveTimer)
  persist()
  emit('hostLifecycle', 'destroyed')
})
</script>

<template>
  <div class="reply-editor">
    <div class="reply-editor__toolbar">
      <span class="reply-editor__label">Replying</span>
      <span v-if="lastSaved" class="reply-editor__saved">
        Draft saved {{ lastSaved.toLocaleTimeString() }}
      </span>
    </div>

    <Eddyter
      v-model="html"
      :api-key="eddyterApiKey"
      mode="edit"
      class="reply-editor__eddyter"
      :toolbar="{ mode: 'static' }"
      :editor="{ maxHeight: '200px' }"
      @ready="logEditor('ready')"
      @focus="logEditor('focus')"
      @blur="logEditor('blur')"
    />

    <h4 class="reply-editor__preview-title">Reply preview</h4>
    <div v-if="hasPreviewContent" class="reply-editor__preview" v-html="html" />
    <p v-else class="reply-editor__preview-empty">Nothing to preview yet.</p>

    <div class="reply-editor__actions">
      <button type="button" class="reply-editor__btn" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
.reply-editor {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
}

.reply-editor__toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.reply-editor__label {
  font-weight: 600;
  color: var(--text-h);
}

.reply-editor__saved {
  color: var(--text);
}

.reply-editor__eddyter {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
}

.reply-editor__preview-title {
  margin: 0.75rem 0 0.35rem;
  font-size: 0.85rem;
  color: var(--text-h);
}

.reply-editor__preview {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
}

.reply-editor__preview-empty {
  margin: 0.35rem 0 0;
  font-size: 0.85rem;
  color: var(--text);
}

.reply-editor__actions {
  margin-top: 0.75rem;
}

.reply-editor__btn {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
  cursor: pointer;
}

.reply-editor__btn:hover {
  background: var(--accent-bg);
}
</style>
