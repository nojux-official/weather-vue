<script setup lang="ts">

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'page-changed', page: number): void
}>()

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page)
  }
}
</script>

<template>
  <nav class="pagination" role="navigation">
    <button
      class="pagination-previous"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      Previous
    </button>
    <button
      class="pagination-next"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      Next page
    </button>
    <ul class="pagination-list">
      <li v-for="page in totalPages" :key="page">
        <button
          class="pagination-link"
          :class="{ 'is-current': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>
  </nav>
</template>