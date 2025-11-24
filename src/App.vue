<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ForecastCard from '@/components/ForecastCard.vue'
import AddForecastModal from '@/components/AddForecastModal.vue'
import { fetchWeather, parseWeatherData } from '@/services/weatherApi'

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

const updateIntervalTime = 10 * 1000; //ms
const forecastQueries = ref<string[]>(localStorage.getItem('forecastQueries')
  ? JSON.parse(localStorage.getItem('forecastQueries') as string)
  : [])
const forecasts = ref<WeatherForecast[]>([])
const searchQuery = ref('')
const isModalVisible = ref(false)
let updateInterval: number | null = null

function handleOpenForecast() {
  isModalVisible.value = true
}
function handleCloseModal() {
  isModalVisible.value = false
}

function addForecast(forecast: string) {
  forecastQueries.value.push(forecast)
  localStorage.setItem('forecastQueries', JSON.stringify(forecastQueries.value))
  updateForecasts()
}

function removeForecast(id: string) {
  
  forecasts.value = forecasts.value.filter(f => f.id !== id)
  forecastQueries.value = []
  forecasts.value.map(f => {
    forecastQueries.value.push(
      `${f.coordinates}`
      )
  })
  console.log('Updated forecastQueries:', forecastQueries.value)
  localStorage.setItem('forecastQueries', JSON.stringify(forecastQueries.value))
  
}

async function handleFilter(event: Event) {
  const target = event.target as HTMLInputElement
  const filterValue = target.value.toLowerCase()

  await updateForecasts()
  
  forecasts.value = forecasts.value.filter(forecast =>
    forecast.city.toLowerCase().includes(filterValue) ||
    forecast.zip.includes(filterValue) ||
    forecast.coordinates.toLowerCase().includes(filterValue)
  )
}

async function updateForecasts() {
  forecasts.value = []
  const promises = forecastQueries.value.map(q =>
    fetchWeather(q).then(data => {
      const forecast = parseWeatherData(data.data)
      forecasts.value.push(forecast)
    }).catch(error => {
      console.error(`Error fetching weather for ${q}:`, error)
    })
  )
  await Promise.all(promises)
}

function startAutoUpdate() {
  updateInterval = window.setInterval(() => {
    console.log('Updating forecasts...', new Date().toLocaleTimeString())
    updateForecasts()
  }, updateIntervalTime)
}

function stopAutoUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
}

onMounted(() => {
  updateForecasts()
  startAutoUpdate()
})

onUnmounted(() => {
  stopAutoUpdate()
})

</script>

<template>
  <div id="app" style="display: flex; flex-direction: column; min-height: 100vh;">
    <button class="button mb-3" @click="handleOpenForecast">Add Forecast</button>

    <div class="field">
      <div style="display: flex; flex-direction: row; gap: 1rem;" class="control">
        <input class="input" type="text" placeholder="Filter forecasts" @change="handleFilter" />
        <button class="button is-info" @click="">Filter</button>
      </div>
    </div>

    <div v-for="forecast in forecasts" :key="forecast.id">
      <ForecastCard
        @remove="removeForecast"
        :forecast="forecast"
        :showRemoveButton="true"
      />
    </div>

    

    <AddForecastModal :isVisible="isModalVisible" @add="addForecast" @close="handleCloseModal" />

    <!-- <div class="notification is-warning" style="margin: 1rem; align-self: end;">
      <strong>Warning:</strong>
      <p>This is a sample notification using Bulma CSS framework.</p>
    </div> -->
  </div>
</template>

<style lang="scss">
@import "bulma";
</style>
