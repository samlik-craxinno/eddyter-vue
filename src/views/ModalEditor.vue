<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ModalEditorContent from '../components/modal/ModalEditorContent.vue'

const MAX_HEIGHT_OPTIONS = ['200px', '320px', '480px'] as const

const open = ref(false)
const toolbarMode = ref<'sticky' | 'static'>('sticky')
const maxHeight = ref<string>('320px')
const mountCount = ref(0)
const destroyCount = ref(0)
const logs = ref<string[]>([])
const contentKey = ref(0)

const reversedLogs = computed(() => [...logs.value].reverse())

const editorConfigKey = computed(
  () => `${toolbarMode.value}-${maxHeight.value}-${contentKey.value}`,
)

function pushLog(line: string) {
  const stamp = new Date().toISOString().slice(11, 23)
  logs.value = [...logs.value, `${stamp}  ${line}`].slice(-100)
}

function bumpContentKey() {
  if (open.value) contentKey.value += 1
}

function openModal() {
  open.value = true
  pushLog('[Modal] opened — mounting editor')
}

function closeModal() {
  open.value = false
  pushLog('[Modal] closed — destroying editor')
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) closeModal()
}

function onEditorLifecycle(event: 'mounted' | 'destroyed') {
  if (event === 'mounted') {
    mountCount.value += 1
    pushLog(`[Modal] Eddyter mounted (total: ${mountCount.value})`)
  } else {
    destroyCount.value += 1
    pushLog(`[Modal] Eddyter destroyed (total: ${destroyCount.value})`)
  }
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) closeModal()
}

watch(toolbarMode, bumpContentKey)
watch(maxHeight, bumpContentKey)

onMounted(() => {
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div class="modal-page">
    <header class="modal-page__header">
      <h1 class="modal-page__title">Modal editor</h1>
      <p class="modal-page__lede">
        The Eddyter instance is created only while the modal is open. Closing the modal
        unmounts the editor and calls <code>destroy()</code> on the SDK instance.
      </p>
    </header>

    <section class="modal-page__controls">
      <h2 class="modal-page__section-title">Toolbar &amp; scrolling</h2>

      <fieldset class="modal-page__fieldset">
        <legend>Toolbar mode</legend>
        <label class="modal-page__radio">
          <input v-model="toolbarMode" type="radio" name="toolbar-mode" value="sticky" />
          Sticky
        </label>
        <label class="modal-page__radio">
          <input v-model="toolbarMode" type="radio" name="toolbar-mode" value="static" />
          Static
        </label>
      </fieldset>

      <label class="modal-page__select-label">
        <span>Editor max height (scrollable content)</span>
        <select v-model="maxHeight">
          <option v-for="option in MAX_HEIGHT_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </section>

    <dl class="modal-page__stats">
      <div>
        <dt>Modal</dt>
        <dd>{{ open ? 'open' : 'closed' }}</dd>
      </div>
      <div>
        <dt>Toolbar</dt>
        <dd>{{ toolbarMode }}</dd>
      </div>
      <div>
        <dt>Max height</dt>
        <dd>{{ maxHeight }}</dd>
      </div>
      <div>
        <dt>Mount count</dt>
        <dd>{{ mountCount }}</dd>
      </div>
      <div>
        <dt>Destroy count</dt>
        <dd>{{ destroyCount }}</dd>
      </div>
    </dl>

    <button type="button" class="modal-page__open-btn" :disabled="open" @click="openModal">
      Open modal editor
    </button>

    <div
      v-if="open"
      class="modal-page__backdrop"
      role="presentation"
      @click="onBackdropClick"
    >
      <div
        class="modal-page__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header class="modal-page__dialog-header">
          <h2 id="modal-title" class="modal-page__dialog-title">Edit in modal</h2>
          <button
            type="button"
            class="modal-page__close-btn"
            aria-label="Close modal"
            @click="closeModal"
          >
            ×
          </button>
        </header>

        <div class="modal-page__dialog-body">
          <ModalEditorContent
            :key="editorConfigKey"
            :toolbar-mode="toolbarMode"
            :max-height="maxHeight"
            @lifecycle="onEditorLifecycle"
          />
        </div>

        <footer class="modal-page__dialog-footer">
          <button type="button" class="modal-page__footer-btn" @click="closeModal">
            Close
          </button>
        </footer>
      </div>
    </div>

    <section class="modal-page__log-section">
      <h2 class="modal-page__section-title">Lifecycle log</h2>
      <ol class="modal-page__log">
        <li v-for="(line, index) in reversedLogs" :key="index">{{ line }}</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.modal-page__header {
  margin-bottom: 1.25rem;
}

.modal-page__title {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
  color: var(--text-h);
}

.modal-page__lede {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: var(--text);
}

.modal-page__controls {
  margin-bottom: 1.25rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
}

.modal-page__section-title {
  font-size: 1rem;
  margin: 0 0 0.75rem;
  color: var(--text-h);
}

.modal-page__fieldset {
  border: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
}

.modal-page__fieldset legend {
  width: 100%;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
  margin-bottom: 0.35rem;
}

.modal-page__radio {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--text-h);
}

.modal-page__select-label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: var(--text-h);
}

.modal-page__select-label select {
  font: inherit;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
}

.modal-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin: 0 0 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
}

.modal-page__stats dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text);
}

.modal-page__stats dd {
  margin: 0.15rem 0 0;
  font-weight: 600;
  color: var(--text-h);
}

.modal-page__open-btn {
  padding: 0.55rem 1rem;
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
}

.modal-page__open-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-page__backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.45);
}

.modal-page__dialog {
  width: min(640px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-page__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.modal-page__dialog-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-h);
}

.modal-page__close-btn {
  border: none;
  background: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text);
}

.modal-page__dialog-body {
  padding: 1rem;
  overflow: auto;
}

.modal-page__dialog-footer {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
}

.modal-page__footer-btn {
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  cursor: pointer;
  color: var(--text-h);
}

.modal-page__log-section {
  margin-top: 1.5rem;
}

.modal-page__log {
  margin: 0;
  padding: 0.75rem 1rem 0.75rem 2rem;
  max-height: 200px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.8rem;
}
</style>
