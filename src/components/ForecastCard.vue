<script setup lang="ts">
import type { WeatherForecast } from '@/App.vue'

const props = defineProps<{
  forecast: WeatherForecast
}>()

</script>

<template>
  <div class="card" style="">
    <div class="card-content">
      <p class="title">
        {{ forecast.city }}, {{ forecast.country }}
      </p>
      <p class="subtitle">
        {{ forecast.weatherCondition }} {{ forecast.weatherImage }}
      </p>
      <div class="content">
        <p>Temperature: {{ forecast.temperature }}°C</p>
        <p>Humidity: {{ forecast.humidity }}%</p>
        <p>Wind Speed: {{ forecast.windSpeed }} km/h</p>
        <p>Pressure: {{ forecast.pressure }} hPa</p>
        <p>Sunrise: {{ forecast.sunrise }}</p>
        <p>Sunset: {{ forecast.sunset }}</p>
      </div>
    </div>
  </div>
</template>
