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
    (e: 'add', forecast: string): void
    (e: 'error', message: string): void
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
    
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    const errorCode = error.response?.data?.cod || error.response?.status || 'N/A'
    
    emit('error', `Error (${errorCode}) for ${searchQuery.value}: ${errorMessage}`)
  })
}

function handleAdd() {
  if (selectedForecast.value) {
    const queryToAdd = searchQuery.value
    forecasts.value = []
    searchQuery.value = ''
    emit('add', queryToAdd)
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
          <div class="field mb-5">
            <label class="label">Location</label>
            <div class="control">
              <input 
                class="input is-medium" 
                type="text" 
                placeholder="City, coordinates (lat,lon), or zip code" 
                @change="handleSearch"
                v-model="searchQuery"
              />
            </div>
            <p class="help">Press Enter or click away to search</p>
          </div>

          <div v-if="forecasts && forecasts.length > 0" class="preview-section">
            <p class="subtitle is-6 mb-3">Preview:</p>
            <ForecastCard v-for="forecast in forecasts" :key="forecast.id" :forecast="forecast" />
          </div>
          
          <div v-else-if="searchQuery" class="has-text-centered py-5">
            <p class="has-text-grey">Searching...</p>
          </div>
        </section>
        
        <footer class="modal-card-foot" style="justify-content: space-between;">
          <button class="button" @click="emit('close')">Cancel</button>
          <button 
            class="button is-primary" 
            :disabled="!selectedForecast"
            @click="handleAdd"
          >
            Add Forecast
          </button>
        </footer>
      </div>
    </div>
</template>

<style scoped>
.modal-card {
  max-width: 500px;
}

.preview-section {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
}
</style>