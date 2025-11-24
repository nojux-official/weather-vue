<script setup lang="ts">
import type { WeatherForecast } from '@/App.vue'

const props = defineProps<{
  forecast: WeatherForecast
}>()

</script>

<template>
  <div class="card" style="">
    FORECAST
  </div>
</template>
