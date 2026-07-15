<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Eddyter } from '@eddyter/vue'
import { eddyterApiKey } from '../../config/eddyter'

const props = defineProps<{
  toolbarMode: 'sticky' | 'static'
  maxHeight: string
}>()

const emit = defineEmits<{
  lifecycle: [event: 'mounted' | 'destroyed']
}>()

const content = ref('<p>Editor initialized when the modal opened.</p>')

function logEditor(event: string, detail?: unknown) {
  if (detail !== undefined) {
    console.log(`[ModalEditor] editor:${event}`, detail)
  } else {
    console.log(`[ModalEditor] editor:${event}`)
  }
}

const toolbarConfig = (mode: 'sticky' | 'static') =>
  mode === 'sticky'
    ? { mode: 'sticky' as const, offset: 10, zIndex: 1000 }
    : { mode: 'static' as const }

onMounted(() => emit('lifecycle', 'mounted'))
onBeforeUnmount(() => emit('lifecycle', 'destroyed'))
</script>

<template>
  <div class="modal-editor-content">
    <Eddyter
      v-model="content"
      :api-key="eddyterApiKey"
      mode="edit"
      class="modal-editor-content__eddyter"
      :toolbar="toolbarConfig(props.toolbarMode)"
      :editor="{ maxHeight: props.maxHeight }"
      @ready="logEditor('ready')"
      @focus="logEditor('focus')"
      @blur="logEditor('blur')"
    />

    <h3 class="modal-editor-content__preview-label">Preview</h3>
    <div class="modal-editor-content__preview" v-html="content" />
  </div>
</template>

<style scoped>
.modal-editor-content__eddyter {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.modal-editor-content__preview-label {
  margin: 0.75rem 0 0.35rem;
  font-size: 0.9rem;
  color: var(--text-h);
}

.modal-editor-content__preview {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--code-bg);
  color: var(--text-h);
}
</style>
