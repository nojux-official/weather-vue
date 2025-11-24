<script setup lang="ts">
import type { WeatherForecast } from '@/App.vue'

const props = defineProps<{
  forecast: WeatherForecast
  showRemoveButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

</script>

<template>
  <div class="card forecast-tile">
    <div class="card-image has-text-centered pt-4">
      <img :src="forecast.weatherImage" :alt="forecast.weatherCondition" class="weather-icon" />
    </div>
    <div class="card-content">
      <div class="has-text-centered mb-3">
        <p class="title is-5 mb-1">{{ forecast.city }}</p>
        <p class="subtitle is-6 mb-2">{{ forecast.country }}</p>
        <p class="is-size-7 has-text-grey">{{ forecast.weatherCondition }}</p>
      </div>
      
      <div class="has-text-centered py-4 temp-section">
        <p class="is-size-2 has-text-weight-bold">{{ forecast.temperature }}°C</p>
      </div>

      <div class="content is-small">
        <div class="level is-mobile mb-2">
          <div class="level-left has-text-grey">💧 Humidity:</div>
          <div class="level-right has-text-weight-semibold">{{ forecast.humidity }}%</div>
        </div>
        <div class="level is-mobile mb-2">
          <div class="level-left has-text-grey">💨 Wind:</div>
          <div class="level-right has-text-weight-semibold">{{ forecast.windSpeed }} km/h</div>
        </div>
        <div class="level is-mobile mb-2">
          <div class="level-left has-text-grey">🎚️ Pressure:</div>
          <div class="level-right has-text-weight-semibold">{{ forecast.pressure }} hPa</div>
        </div>
        <div class="level is-mobile mb-2">
          <div class="level-left has-text-grey">🌅 Sunrise:</div>
          <div class="level-right has-text-weight-semibold">{{ forecast.sunrise }}</div>
        </div>
        <div class="level is-mobile mb-2">
          <div class="level-left has-text-grey">🌇 Sunset:</div>
          <div class="level-right has-text-weight-semibold">{{ forecast.sunset }}</div>
        </div>
      </div>
    </div>
    <footer class="card-footer" v-if="showRemoveButton">
      <a class="card-footer-item has-text-danger" @click.prevent="emit('remove', forecast.id)">
        Remove
      </a>
    </footer>
  </div>
</template>

<style scoped>
.forecast-tile {
  height: 100%;
  transition: transform 0.2s;
}

.forecast-tile:hover {
  transform: translateY(-4px);
}

.weather-icon {
  width: 80px;
  height: 80px;
}

.temp-section {
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>
