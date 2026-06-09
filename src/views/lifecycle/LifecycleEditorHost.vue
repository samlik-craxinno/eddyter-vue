<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { EddyterEditor } from '@eddyter/vue'
import { eddyterApiKey } from '../../config/eddyter'

const emit = defineEmits<{
  bridgeMounted: []
  bridgeUnmounting: []
  editorLifecycle: [phase: string, detail?: unknown]
}>()

const content = ref('<p>Editor inside dynamic host — toggle visibility or recreate to test lifecycle.</p>')

onMounted(() => {
  emit('bridgeMounted')
})

onBeforeUnmount(() => {
  emit('bridgeUnmounting')
})

function emitEditor(phase: string, detail?: unknown) {
  emit('editorLifecycle', phase, detail)
}
</script>

<template>
  <div class="lifecycle-host">
    <EddyterEditor
      v-model="content"
      :api-key="eddyterApiKey"
      mode="edit"
      class="lifecycle-host__eddyter"
      editor-class="lifecycle-host__eddyter-inner"
      :toolbar="{ mode: 'sticky' }"
      :editor="{ maxHeight: '280px' }"
      @ready="emitEditor('ready')"
      @focus="emitEditor('focus')"
      @blur="emitEditor('blur')"
      @height-change="emitEditor('height-change', $event)"
      @auth-success="emitEditor('auth-success')"
      @auth-error="emitEditor('auth-error', $event)"
      @preview-click="emitEditor('preview-click')"
    />
    <p class="lifecycle-host__hint">Preview (same model)</p>
    <div class="lifecycle-host__preview" v-html="content" />
  </div>
</template>

<style scoped>
.lifecycle-host {
  min-width: 0;
}

.lifecycle-host__eddyter {
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  overflow: hidden;
}

.lifecycle-host__hint {
  margin: 0.65rem 0 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-h, inherit);
}

.lifecycle-host__preview {
  min-height: 72px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 8px;
  background: var(--code-bg, #f8f8f8);
  color: var(--text-h, inherit);
  font-size: 0.9rem;
}

.lifecycle-host__preview :deep(p) {
  margin: 0.35em 0;
}
</style>
