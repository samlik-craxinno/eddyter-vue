<script setup lang="ts">
import { ref } from 'vue'
import { EddyterEditor } from 'richtext-core-vue'

const apiKey =
  import.meta.env.VITE_EDDYTER_API_KEY ??
  'eddyt_6mFaEEGvGtK6rvu1CR8IFlsjosLQApohJ9G06oVT83b4GROaXIqyQrWDUPoqV14ZW8tI44KpLSeVoUuezdCvPuvgfI'

const excerptHtml = ref('<p><em>Excerpt</em> — short summary for listings.</p>')
const bodyHtml = ref('<p><strong>Body</strong> — main article content.</p>')
const seoHtml = ref('<p>SEO — meta description and structured notes.</p>')

type EditorSlot = 'excerpt' | 'body' | 'seo'

function logEditor(slot: EditorSlot, event: string, detail?: unknown) {
  const prefix = `[MultiEditors:${slot}]`
  if (detail !== undefined) {
    console.log(`${prefix} ${event}`, detail)
  } else {
    console.log(`${prefix} ${event}`)
  }
}
</script>

<template>
  <div class="multi-editors">
    <header class="multi-editors__header">
      <h1 class="multi-editors__title">Multi editors</h1>
      <p class="multi-editors__lede">
        Three separate Eddyter instances: excerpt, body, and SEO. Each keeps its own HTML
        state, console callbacks, and preview.
      </p>
    </header>

    <section class="multi-editors__block">
      <h2 class="multi-editors__block-title">Excerpt</h2>
      <EddyterEditor
        v-model="excerptHtml"
        :api-key="apiKey"
        mode="edit"
        class="multi-editors__eddyter"
        editor-class="multi-editors__eddyter-inner"
        :toolbar="{ mode: 'static' }"
        :editor="{ maxHeight: '260px' }"
        @ready="logEditor('excerpt', 'ready')"
        @focus="logEditor('excerpt', 'focus')"
        @blur="logEditor('excerpt', 'blur')"
        @height-change="logEditor('excerpt', 'height-change', $event)"
        @auth-success="logEditor('excerpt', 'auth-success')"
        @auth-error="logEditor('excerpt', 'auth-error', $event)"
        @preview-click="logEditor('excerpt', 'preview-click')"
      />
      <h3 class="multi-editors__preview-label">Preview</h3>
      <div class="multi-editors__preview" v-html="excerptHtml" />
    </section>

    <section class="multi-editors__block">
      <h2 class="multi-editors__block-title">Body</h2>
      <EddyterEditor
        v-model="bodyHtml"
        :api-key="apiKey"
        mode="edit"
        class="multi-editors__eddyter"
        editor-class="multi-editors__eddyter-inner"
        :toolbar="{ mode: 'static' }"
        :editor="{ maxHeight: '320px' }"
        @ready="logEditor('body', 'ready')"
        @focus="logEditor('body', 'focus')"
        @blur="logEditor('body', 'blur')"
        @height-change="logEditor('body', 'height-change', $event)"
        @auth-success="logEditor('body', 'auth-success')"
        @auth-error="logEditor('body', 'auth-error', $event)"
        @preview-click="logEditor('body', 'preview-click')"
      />
      <h3 class="multi-editors__preview-label">Preview</h3>
      <div class="multi-editors__preview" v-html="bodyHtml" />
    </section>

    <section class="multi-editors__block">
      <h2 class="multi-editors__block-title">SEO</h2>
      <EddyterEditor
        v-model="seoHtml"
        :api-key="apiKey"
        mode="edit"
        class="multi-editors__eddyter"
        editor-class="multi-editors__eddyter-inner"
        :toolbar="{ mode: 'static' }"
        :editor="{ maxHeight: '220px' }"
        @ready="logEditor('seo', 'ready')"
        @focus="logEditor('seo', 'focus')"
        @blur="logEditor('seo', 'blur')"
        @height-change="logEditor('seo', 'height-change', $event)"
        @auth-success="logEditor('seo', 'auth-success')"
        @auth-error="logEditor('seo', 'auth-error', $event)"
        @preview-click="logEditor('seo', 'preview-click')"
      />
      <h3 class="multi-editors__preview-label">Preview</h3>
      <div class="multi-editors__preview" v-html="seoHtml" />
    </section>
  </div>
</template>

<style scoped>
.multi-editors {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 0 2rem;
}

.multi-editors__header {
  margin-bottom: 2rem;
}

.multi-editors__title {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
}

.multi-editors__lede {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: var(--text, inherit);
}

.multi-editors__block {
  margin-bottom: 2rem;
  min-width: 0;
}

.multi-editors__block:last-child {
  margin-bottom: 0;
}

.multi-editors__block-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.multi-editors__eddyter {
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  overflow: hidden;
}

.multi-editors__preview-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0.75rem 0 0.35rem;
  color: var(--text-h, inherit);
}

.multi-editors__preview {
  min-height: 120px;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 8px;
  background: var(--code-bg, #f8f8f8);
  color: var(--text-h, inherit);
  overflow: auto;
}

.multi-editors__preview :deep(p) {
  margin: 0.4em 0;
}

.multi-editors__preview :deep(p:first-child) {
  margin-top: 0;
}
</style>
