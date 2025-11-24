<script setup lang="ts">
import { ref } from 'vue'
import type { WeatherForecast } from '@/App.vue'
import ForecastCard from '@/components/ForecastCard.vue'
import { fetchWeather, parseWeatherData } from '@/services/weatherApi'

const props = defineProps<{
    isVisible: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'add', forecast: WeatherForecast): void
}>()

const forecasts = ref<WeatherForecast[]>()
const searchQuery = ref('')
const selectedForecast = ref<WeatherForecast | null>(null)

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value

  fetchWeather(searchQuery.value).then(data => {
    const parsedForecast = parseWeatherData(data.data)
    forecasts.value = [parsedForecast]
    selectedForecast.value = parsedForecast
  }).catch(error => {
    console.error(`Error fetching weather data for ${searchQuery.value}:`, error)
  })
}

function handleAdd() {
  if (selectedForecast.value) {
    emit('add', selectedForecast.value)
    emit('close')
  }
}

</script>

<template>
    <div v-if="isVisible" class="modal is-active">
      <div class="modal-background" @click="emit('close')"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Weather Forecast</p>
          <button class="delete" aria-label="close" @click="emit('close')"></button>
        </header>
        
        <section class="modal-card-body">
          <div class="field">
            <div class="control">
              <input 
                class="input" 
                type="text" 
                placeholder="Enter city OR coordinates lat,lon OR zip,country)" 
                @change="handleSearch" 
              />
            </div>
          </div>

          <div v-if="searchQuery">
            <p class="mb-3">Searching for: <strong>{{ searchQuery }}</strong></p>
            <div v-for="forecast in forecasts" :key="forecast.id">
              <ForecastCard :forecast="forecast" />
            </div>
          </div>
        </section>
        
        <footer class="modal-card-foot">
          <div class="buttons">
            <button 
              class="button is-success" 
              :disabled="!selectedForecast"
              @click="handleAdd"
            >
              Add Forecast
            </button>
            <button class="button" @click="emit('close')">Cancel</button>
          </div>
        </footer>
      </div>
    </div>
</template>