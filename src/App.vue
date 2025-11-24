<script setup lang="ts">
import { ref } from 'vue'
import ForecastCard from '@/components/ForecastCard.vue'
import AddForecastModal from '@/components/AddForecastModal.vue'
import { fetchWeather } from '@/services/weatherApi'

export interface WeatherForecast {
  id: string
  city: string
  country: string
  zip: string
  coordinates: string
  temperature: number
  humidity: number
  windSpeed: number
  pressure: number
  sunrise: string
  sunset: string
  weatherCondition: string
  weatherImage: string
}


const initialForecasts: WeatherForecast[] = [
  {
    id: '1',
    city: 'London',
    country: 'GB',
    zip: 'SW1A 1AA',
    coordinates: '51.5074° N, 0.1278° W',
    temperature: 15,
    humidity: 72,
    windSpeed: 5.2,
    pressure: 1013,
    sunrise: '06:45 AM',
    sunset: '05:30 PM',
    weatherCondition: 'Cloudy',
    weatherImage: '☁️',
  },
  {
    id: '2',
    city: 'Tokyo',
    country: 'JP',
    zip: '100-0001',
    coordinates: '35.6895° N, 139.6917° E',
    temperature: 22,
    humidity: 65,
    windSpeed: 3.8,
    pressure: 1015,
    sunrise: '05:30 AM',
    sunset: '04:45 PM',
    weatherCondition: 'Clear',
    weatherImage: '☀️',
  },
  {
    id: '3',
    city: 'New York',
    country: 'US',
    zip: '10001',
    coordinates: '40.7128° N, 74.0060° W',
    temperature: 18,
    humidity: 68,
    windSpeed: 6.5,
    pressure: 1012,
    sunrise: '06:20 AM',
    sunset: '05:00 PM',
    weatherCondition: 'Rainy',
    weatherImage: '🌧️',
  },
]

const forecasts = ref<WeatherForecast[]>(initialForecasts)
const searchQuery = ref('')

const isModalVisible = ref(false)

function handleOpenForecast() {
  isModalVisible.value = true
}
function handleCloseModal() {
  isModalVisible.value = false
}

function handleFilter(event: Event) {
  const target = event.target as HTMLInputElement
  
  forecasts.value = initialForecasts.filter(forecast =>
    forecast.city.toLowerCase().includes(target.value.toLowerCase()) ||
    forecast.zip.includes(target.value) ||
    forecast.coordinates.toLowerCase().includes(target.value.toLowerCase())
  )
}

fetchWeather('London').then(data => {
  console.log('Weather data for London:', data)
}).catch(error => {
  console.error('Error fetching weather data for London:', error)
})

</script>

<template>
  <div id="app" style="display: flex; flex-direction: column; min-height: 100vh;">
    <div class="field">
      <div style="display: flex; flex-direction: row; gap: 1rem;" class="control">
        <input class="input" type="text" placeholder="Filter forecasts" @change="handleFilter" />
        <button class="button is-info" @click="">Filter</button>
      </div>
    </div>

    <button class="button" @click="handleOpenForecast">Add Forecast</button>

    <div v-for="forecast in forecasts">
      <ForecastCard
        :forecast="forecast"
      />
    </div>

    

    <AddForecastModal :isVisible="isModalVisible" @close="handleCloseModal" />

    <!-- <div class="notification is-warning" style="margin: 1rem; align-self: end;">
      <strong>Warning:</strong>
      <p>This is a sample notification using Bulma CSS framework.</p>
    </div> -->
  </div>
</template>

<style lang="scss">
@import "bulma";
</style>
