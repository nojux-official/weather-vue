<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    isVisible: boolean
}>()
</script>

<template>
    <div v-if="isVisible" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        MODAL
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
</template>