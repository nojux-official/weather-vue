<script setup lang="ts">
import { ref } from 'vue'
import ForecastCard from '@/components/ForecastCard.vue'
import AddForecastModal from '@/components/AddForecastModal.vue'

export interface WeatherForecast {
  id: string
  city: string
  country: string
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

</script>

<template>
  <div id="app" style="display: flex; flex-direction: column; min-height: 100vh;">
    <div class="field">
      <div class="control">
        <input class="input" type="text" placeholder="Filter forecasts" />
      </div>
    </div>

    <div v-for="forecast in forecasts">
      <ForecastCard
        :forecast="forecast"
      />
    </div>

    <button class="button" @click="handleOpenForecast">Add Forecast</button>

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
