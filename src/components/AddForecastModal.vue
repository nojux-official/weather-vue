<script setup lang="ts">
import { ref } from 'vue'
import type { WeatherForecast } from '@/App.vue'
import ForecastCard from '@/components/ForecastCard.vue'
import { fetchWeather } from '@/services/weatherApi'

const props = defineProps<{
    isVisible: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const forecasts = ref<WeatherForecast[]>()
const searchQuery = ref('')

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  fetchWeather(searchQuery.value).then(data => {
    console.log(`Weather data for ${searchQuery.value}:`, data)
  }).catch(error => {
    console.error(`Error fetching weather data for ${searchQuery.value}:`, error)
  })

}

</script>

<template>
    <div v-if="isVisible" class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="field">
          <div style="display: flex; flex-direction: row; gap: 1rem;" class="control">
            <input class="input" type="text" placeholder="Search for a forecasts" @change="handleSearch" />
            <button class="button is-info" @click="">Filter</button>
          </div>
        </div>

        <h3 class="title is-3">Results:</h3>
        <div v-if="searchQuery">
          <p>Searching for: {{ searchQuery }}</p>
          <div v-for="forecast in forecasts">
            <ForecastCard
              :forecast="forecast"
            />
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="emit('close')"></button>
    </div>
</template>