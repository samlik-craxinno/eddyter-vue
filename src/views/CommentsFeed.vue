<script setup lang="ts">
import { computed, ref } from 'vue'
import { FAKE_POSTS } from '../data/feed-posts'
import ReplyEditor from '../components/comments/ReplyEditor.vue'

const activeReplies = ref<string[]>([])
const mountCount = ref(0)
const destroyCount = ref(0)
const logs = ref<string[]>([])

const reversedLogs = computed(() => [...logs.value].reverse())

function pushLog(line: string) {
  const stamp = new Date().toISOString().slice(11, 23)
  logs.value = [...logs.value, `${stamp}  ${line}`].slice(-200)
}

function isReplyOpen(postId: string) {
  return activeReplies.value.includes(postId)
}

function openReply(postId: string) {
  if (isReplyOpen(postId)) return
  activeReplies.value = [...activeReplies.value, postId]
  pushLog(`[Feed] open reply editor for ${postId}`)
}

function cancelReply(postId: string) {
  activeReplies.value = activeReplies.value.filter((id) => id !== postId)
  pushLog(`[Feed] cancel — destroying editor for ${postId}`)
}

function onHostLifecycle(event: 'mounted' | 'destroyed', postId: string) {
  if (event === 'mounted') {
    mountCount.value += 1
    pushLog(`[Feed] ReplyEditor mounted (${postId}) — total: ${mountCount.value}`)
  } else {
    destroyCount.value += 1
    pushLog(`[Feed] ReplyEditor destroyed (${postId}) — total: ${destroyCount.value}`)
  }
}
</script>

<template>
  <div class="comments-feed">
    <header class="comments-feed__header">
      <h1 class="comments-feed__title">Comments</h1>
      <p class="comments-feed__lede">
        Fake social feed with dynamically mounted reply editors. Open multiple replies at once;
        <strong>Cancel</strong> unmounts and destroys the editor instance.
      </p>
    </header>

    <dl class="comments-feed__stats">
      <div>
        <dt>Active editors</dt>
        <dd>{{ activeReplies.length }}</dd>
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

    <ul class="comments-feed__list">
      <li v-for="post in FAKE_POSTS" :key="post.id" class="post-card">
        <div class="post-card__avatar" aria-hidden="true">{{ post.avatar }}</div>
        <div class="post-card__body">
          <div class="post-card__meta">
            <span class="post-card__author">{{ post.author }}</span>
            <span class="post-card__handle">{{ post.handle }}</span>
            <span class="post-card__time">· {{ post.timeAgo }}</span>
          </div>
          <p class="post-card__text">{{ post.body }}</p>

          <div class="post-card__actions">
            <span v-if="isReplyOpen(post.id)" class="post-card__replying">Replying…</span>
            <button
              v-else
              type="button"
              class="post-card__reply-btn"
              @click="openReply(post.id)"
            >
              Reply
            </button>
          </div>

          <ReplyEditor
            v-if="isReplyOpen(post.id)"
            :post-id="post.id"
            @cancel="cancelReply(post.id)"
            @host-lifecycle="onHostLifecycle($event, post.id)"
          />
        </div>
      </li>
    </ul>

    <section class="comments-feed__log-section">
      <h2 class="comments-feed__log-title">Lifecycle debug log</h2>
      <ol class="comments-feed__log">
        <li v-for="(line, index) in reversedLogs" :key="index">{{ line }}</li>
        <li v-if="logs.length === 0" class="comments-feed__log-empty">
          Open a reply editor to see lifecycle events.
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.comments-feed__header {
  margin-bottom: 1.25rem;
}

.comments-feed__title {
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
  color: var(--text-h);
}

.comments-feed__lede {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.45;
  color: var(--text);
}

.comments-feed__stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin: 0 0 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
}

.comments-feed__stats dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text);
}

.comments-feed__stats dd {
  margin: 0.15rem 0 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-h);
}

.comments-feed__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-card {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}

.post-card__avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
}

.post-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
}

.post-card__author {
  font-weight: 600;
  color: var(--text-h);
}

.post-card__handle,
.post-card__time {
  color: var(--text);
}

.post-card__text {
  margin: 0 0 0.5rem;
  color: var(--text-h);
}

.post-card__reply-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
}

.post-card__replying {
  font-size: 0.85rem;
  color: var(--accent);
}

.comments-feed__log-section {
  margin-top: 1.5rem;
}

.comments-feed__log-title {
  font-size: 1rem;
  margin: 0 0 0.5rem;
  color: var(--text-h);
}

.comments-feed__log {
  margin: 0;
  padding: 0.75rem 1rem 0.75rem 2rem;
  max-height: 240px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--code-bg);
  font-family: ui-monospace, Consolas, monospace;
  font-size: 0.8rem;
}

.comments-feed__log-empty {
  color: var(--text);
  list-style: none;
  margin-left: -1rem;
}
</style>
