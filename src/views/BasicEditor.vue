<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { EddyterEditor } from '@eddyter/vue'
import { eddyterApiKey } from '../config/eddyter'

const STORAGE_TITLE = 'basic-editor:title'
const STORAGE_HTML = 'basic-editor:html'

function loadInitial(): { title: string; html: string } {
  if (typeof window === 'undefined') {
    return { title: '', html: '<p></p>' }
  }
  return {
    title: localStorage.getItem(STORAGE_TITLE) ?? '',
    html: localStorage.getItem(STORAGE_HTML) ?? '<p></p>',
  }
}

const STORAGE_DARK = 'basic-editor:dark'

function loadDarkMode(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem(STORAGE_DARK)
  if (stored !== null) return stored === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const initial = loadInitial()
const title = ref(initial.title)
const content = ref(initial.html)
const isDark = ref(loadDarkMode())

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_DARK, String(isDark.value))
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null

function persist() {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_TITLE, title.value)
  localStorage.setItem(STORAGE_HTML, content.value)
}

function schedulePersist() {
  if (saveTimer !== null) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    persist()
    saveTimer = null
  }, 400)
}

watch([title, content], schedulePersist)

function logEditor(event: string, detail?: unknown) {
  if (detail !== undefined) {
    console.log(`[BasicEditor] editor:${event}`, detail)
  } else {
    console.log(`[BasicEditor] editor:${event}`)
  }
}

onMounted(() => {
  console.log('[BasicEditor] page:mounted')
})

onUnmounted(() => {
  console.log('[BasicEditor] page:unmounted')
  if (saveTimer !== null) clearTimeout(saveTimer)
  persist()
})
</script>

<template>
  <div class="basic-editor">
    <header class="basic-editor__header">
      <div class="basic-editor__header-row">
        <h1 class="basic-editor__title">Basic editor</h1>
        <button
          type="button"
          class="basic-editor__theme-toggle"
          :aria-pressed="isDark"
          @click="toggleDarkMode"
        >
          {{ isDark ? 'Light mode' : 'Dark mode' }}
        </button>
      </div>
      <label class="basic-editor__label">
        <span class="basic-editor__label-text">Title</span>
        <input
          v-model="title"
          type="text"
          class="basic-editor__input"
          placeholder="Document title"
          autocomplete="off"
        />
      </label>
    </header>

    <div class="basic-editor__grid">
      <section class="basic-editor__panel">
        <h2 class="basic-editor__panel-title">Editor</h2>
        <EddyterEditor
          v-model="content"
          :api-key="eddyterApiKey"
          mode="edit"
          class="basic-editor__eddyter"
          editor-class="basic-editor__eddyter-inner"
          :toolbar="{ mode: 'static' }"
          :editor="{ maxHeight: '420px' }"
          :mentionUserList="['Sam']"
          :dark-mode="isDark"
          @ready="logEditor('ready')"
          @focus="logEditor('focus')"
          @blur="logEditor('blur')"
          @height-change="logEditor('height-change', $event)"
          @auth-success="logEditor('auth-success')"
          @auth-error="logEditor('auth-error', $event)"
          @preview-click="logEditor('preview-click')"
        />
      </section>

      <section class="basic-editor__panel">
        <h2 class="basic-editor__panel-title">Live HTML preview</h2>
        <div class="basic-editor__preview" v-html="content" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.basic-editor {
  max-width: 1200px;
  margin: 0 auto;
}

.basic-editor__header {
  margin-bottom: 1.5rem;
}

.basic-editor__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.basic-editor__title {
  font-size: 1.75rem;
  margin: 0;
}

.basic-editor__theme-toggle {
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 8px;
  background: var(--bg, #fff);
  color: var(--text-h, inherit);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.basic-editor__theme-toggle:hover {
  border-color: var(--accent-border, #9333ea);
  background: var(--accent-bg, rgba(147, 51, 234, 0.1));
}

.basic-editor__theme-toggle:focus-visible {
  outline: 2px solid var(--accent, #9333ea);
  outline-offset: 2px;
}

.basic-editor__label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.basic-editor__label-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-h, inherit);
}

.basic-editor__input {
  font: inherit;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 8px;
  background: var(--bg, #fff);
  color: var(--text-h, inherit);
}

.basic-editor__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.basic-editor__panel {
  min-width: 0;
}

.basic-editor__panel-title {
  font-size: 1rem;
  margin: 0 0 0.5rem;
}

.basic-editor__eddyter {
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  overflow: hidden;
}

.basic-editor__preview {
  min-height: 200px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  background: var(--code-bg, #f8f8f8);
  color: var(--text-h, inherit);
  overflow: auto;
}

.basic-editor__preview :deep(p) {
  margin: 0.5em 0;
}

.basic-editor__preview :deep(p:first-child) {
  margin-top: 0;
}
</style>
