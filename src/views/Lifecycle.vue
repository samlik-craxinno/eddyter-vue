<script setup lang="ts">
import { markRaw, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import LifecycleEditorHost from './lifecycle/LifecycleEditorHost.vue'

/** Stable component reference for `<component :is="…">` (dynamic mounting). */
const EditorHost = shallowRef(markRaw(LifecycleEditorHost))

const visible = ref(true)
const editorKey = ref(0)
const mountCount = ref(0)
const destroyCount = ref(0)
const logs = ref<string[]>([])

function pushLog(line: string) {
  const stamp = new Date().toISOString().slice(11, 23)
  logs.value = [...logs.value, `${stamp}  ${line}`].slice(-200)
}

function showEditor() {
  visible.value = true
}

function hideEditor() {
  visible.value = false
}

function recreateEditor() {
  editorKey.value += 1
}

function onHostMounted() {
  mountCount.value += 1
  pushLog(`[Lifecycle] editor host mounted (total mounts: ${mountCount.value})`)
}

function onHostUnmounting() {
  destroyCount.value += 1
  pushLog(`[Lifecycle] editor host onBeforeUnmount (total destroys: ${destroyCount.value})`)
}

function onEditorLifecycle(phase: string, detail?: unknown) {
  if (detail === undefined) {
    pushLog(`[Lifecycle] Eddyter:${phase}`)
    return
  }
  const extra =
    typeof detail === 'string' || typeof detail === 'number' || typeof detail === 'boolean'
      ? String(detail)
      : (() => {
          try {
            return JSON.stringify(detail)
          } catch {
            return String(detail)
          }
        })()
  pushLog(`[Lifecycle] Eddyter:${phase} (${extra})`)
}

onMounted(() => {
  pushLog('[Lifecycle] page onMounted')
})

onBeforeUnmount(() => {
  pushLog('[Lifecycle] page onBeforeUnmount')
})
</script>

<template>
  <div class="lifecycle-page">
    <header class="lifecycle-page__header">
      <h1 class="lifecycle-page__title">Lifecycle</h1>
      <p class="lifecycle-page__lede">
        Editor is mounted with
        <code>v-if</code>
        and a dynamic
        <code>&lt;component :is="EditorHost" /&gt;</code>
        . Changing
        <code>:key</code>
        recreates the subtree without hiding the shell.
      </p>
    </header>

    <div class="lifecycle-page__toolbar">
      <button type="button" class="lifecycle-page__btn" @click="showEditor">Show Editor</button>
      <button type="button" class="lifecycle-page__btn" @click="hideEditor">Hide Editor</button>
      <button type="button" class="lifecycle-page__btn lifecycle-page__btn--accent" @click="recreateEditor">
        Recreate Editor
      </button>
    </div>

    <dl class="lifecycle-page__stats">
      <div>
        <dt>Mount count</dt>
        <dd>{{ mountCount }}</dd>
      </div>
      <div>
        <dt>Destroy count</dt>
        <dd>{{ destroyCount }}</dd>
      </div>
      <div>
        <dt>Visible</dt>
        <dd>{{ visible ? 'yes' : 'no' }}</dd>
      </div>
      <div>
        <dt>Editor key</dt>
        <dd>{{ editorKey }}</dd>
      </div>
    </dl>

    <section class="lifecycle-page__editor-slot">
      <h2 class="lifecycle-page__section-title">Editor slot</h2>
      <p v-if="!visible" class="lifecycle-page__placeholder">Editor hidden (<code>v-if="false"</code>)</p>
      <component
        :is="EditorHost"
        v-if="visible"
        :key="editorKey"
        @bridge-mounted="onHostMounted"
        @bridge-unmounting="onHostUnmounting"
        @editor-lifecycle="(phase, detail) => onEditorLifecycle(phase, detail)"
      />
    </section>

    <section class="lifecycle-page__log-section">
      <h2 class="lifecycle-page__section-title">Lifecycle logs</h2>
      <ol class="lifecycle-page__log" reversed>
        <li v-for="(line, i) in [...logs].reverse()" :key="logs.length - i">{{ line }}</li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.lifecycle-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 0 0 2rem;
}

.lifecycle-page__header {
  margin-bottom: 1.25rem;
}

.lifecycle-page__title {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
}

.lifecycle-page__lede {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: var(--text, inherit);
}

.lifecycle-page__lede code {
  font-size: 0.85em;
}

.lifecycle-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lifecycle-page__btn {
  font: inherit;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--border, #ccc);
  background: var(--bg, #fff);
  color: var(--text-h, inherit);
  cursor: pointer;
}

.lifecycle-page__btn:hover {
  filter: brightness(0.97);
}

.lifecycle-page__btn--accent {
  border-color: var(--accent-border, #9333ea);
  background: var(--accent-bg, rgba(147, 51, 234, 0.12));
}

.lifecycle-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem 1rem;
  margin: 0 0 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  background: var(--code-bg, #f8f8f8);
}

.lifecycle-page__stats dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text, inherit);
}

.lifecycle-page__stats dd {
  margin: 0.15rem 0 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-h, inherit);
}

.lifecycle-page__editor-slot {
  margin-bottom: 1.5rem;
  min-width: 0;
}

.lifecycle-page__section-title {
  font-size: 1.05rem;
  margin: 0 0 0.5rem;
}

.lifecycle-page__placeholder {
  margin: 0;
  padding: 1rem;
  border: 1px dashed var(--border, #ccc);
  border-radius: 8px;
  color: var(--text, inherit);
  font-size: 0.9rem;
}

.lifecycle-page__log-section {
  min-width: 0;
}

.lifecycle-page__log {
  margin: 0;
  padding: 0.75rem 0.75rem 0.75rem 1.5rem;
  max-height: 320px;
  overflow: auto;
  border: 1px solid var(--border, #ccc);
  border-radius: 10px;
  background: var(--bg, #fff);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.8rem;
  line-height: 1.45;
}

.lifecycle-page__log li {
  margin-bottom: 0.25rem;
}
</style>
