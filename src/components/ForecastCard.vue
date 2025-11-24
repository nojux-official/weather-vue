<script setup lang="ts">
import type { WeatherForecast } from '@/App.vue'

const props = defineProps<{
  forecast: WeatherForecast
  showRemoveButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove', idx: number): void
}>()

</script>

<template>
  <div class="card mb-4 p-2">
    <div class="card-content">
      <p class="title">
        {{ forecast.city }}, {{ forecast.country }}
      </p>
      <p class="subtitle">
        {{ forecast.weatherCondition }} 
      </p>
      <img :src="forecast.weatherImage" :alt="forecast.weatherCondition" />
      <div class="content">
        <p>Temperature: {{ forecast.temperature }}°C</p>
        <p>Humidity: {{ forecast.humidity }}%</p>
        <p>Wind Speed: {{ forecast.windSpeed }} km/h</p>
        <p>Pressure: {{ forecast.pressure }} hPa</p>
        <p>Sunrise: {{ forecast.sunrise }}</p>
        <p>Sunset: {{ forecast.sunset }}</p>
      </div>
    </div>
    <button v-if="showRemoveButton" class="button is-danger" @click.prevent="emit('remove', forecast.id)">Remove</button>
  </div>
</template>
