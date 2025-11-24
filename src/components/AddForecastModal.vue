<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    isVisible: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
    <div v-if="isVisible" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        MODAL
      </div>
      <button class="modal-close is-large" aria-label="close" @click="emit('close')"></button>
    </div>
</template>