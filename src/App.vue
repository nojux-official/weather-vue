<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ForecastCard from '@/components/ForecastCard.vue'
import AddForecastModal from '@/components/AddForecastModal.vue'
import Pagination from '@/components/Pagination.vue'
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

/*
.d88888b   88888888b d888888P dP     dP  888888ba  
88.    "'  88           88    88     88  88    `8b 
`Y88888b. a88aaaa       88    88     88 a88aaaa8P' 
      `8b  88           88    88     88  88        
d8'   .8P  88           88    Y8.   .8P  88        
 Y88888P   88888888P    dP    `Y88888P'  dP        
                                                   
                                                   
*/
const updateIntervalTime = 10 * 1000; //ms
const recordsPerPage = 10;

const page = ref(1)
const totalPages = ref(1)
const forecastQueries = ref<string[]>(localStorage.getItem('forecastQueries')
  ? JSON.parse(localStorage.getItem('forecastQueries') as string)
  : [])
const forecasts = ref<WeatherForecast[]>([])
const isModalVisible = ref(false)
const hasErrors = ref(false)
const errorMessage = ref("")
let updateInterval: number | null = null


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


/*
dP     dP   .d888888  888888ba  888888ba  dP         88888888b  888888ba  .d88888b  
88     88  d8'    88  88    `8b 88    `8b 88         88         88    `8b 88.    "' 
88aaaaa88a 88aaaaa88a 88     88 88     88 88        a88aaaa    a88aaaa8P' `Y88888b. 
88     88  88     88  88     88 88     88 88         88         88   `8b.       `8b 
88     88  88     88  88     88 88    .8P 88         88         88     88 d8'   .8P 
dP     dP  88     88  dP     dP 8888888P  88888888P  88888888P  dP     dP  Y88888P  
                                                                                    
                                                                                    
*/
function handleOpenForecast() {
  isModalVisible.value = true
}
function handleCloseModal() {
  isModalVisible.value = false
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

function handleError(message: string) {
  hasErrors.value = true
  errorMessage.value = message
  setTimeout(() => {
    hasErrors.value = false
    errorMessage.value = ""
  }, 5000)
}


/*
dP     dP d888888P dP dP        
88     88    88    88 88        
88     88    88    88 88        
88     88    88    88 88        
Y8.   .8P    88    88 88        
`Y88888P'    dP    dP 88888888P 
                                
                                
*/

function addForecast(forecast: string) {
  forecastQueries.value.push(forecast)
  localStorage.setItem('forecastQueries', JSON.stringify(forecastQueries.value))
  updateForecasts()
}

function removeForecast(id: string) {
  const startIdx = (page.value - 1) * 10;

  const idx = startIdx + forecasts.value.findIndex(f => f.id === id)
  forecasts.value = forecasts.value.filter(f => f.id !== id)
  forecastQueries.value.splice(idx, 1)
  
  console.log('Updated forecastQueries:', forecastQueries.value)
  localStorage.setItem('forecastQueries', JSON.stringify(forecastQueries.value))
  updateForecasts()
}

async function updateForecasts() {
  forecasts.value = []

  totalPages.value = Math.floor(forecastQueries.value.length / recordsPerPage) + 1;

  const startIdx = (page.value - 1) * 10;
  const endIdx = startIdx + 10;
  const queriesInPage = forecastQueries.value.slice(startIdx, endIdx);

  const promises = queriesInPage.map(q =>
    fetchWeather(q).then(data => {
      const forecast = parseWeatherData(data.data)

      forecasts.value.push(forecast)
    }).catch(error => {
      console.error(`Error fetching weather for ${q}:`, error)
      handleError(`Error fetching weather for ${q}: ${error.message}`)
    })
  )
  await Promise.all(promises)
}

</script>

/*
d888888P  88888888b 8888ba.88ba   888888ba  dP         .d888888  d888888P  88888888b 
   88     88        88  `8b  `8b  88    `8b 88        d8'    88     88     88        
   88    a88aaaa    88   88   88 a88aaaa8P' 88        88aaaaa88a    88    a88aaaa    
   88     88        88   88   88  88        88        88     88     88     88        
   88     88        88   88   88  88        88        88     88     88     88        
   dP     88888888P dP   dP   dP  dP        88888888P 88     88     dP     88888888P 
                                                                                     
                                                                                     
*/

<template>
  <div id="app" style="display: flex; flex-direction: column; min-height: 100vh;">
    <button class="button mb-3" @click="handleOpenForecast">Add Forecast</button>

    <div class="field">
      <div style="display: flex; flex-direction: row; gap: 1rem;" class="control">
        <input class="input" type="text" placeholder="Filter forecasts" @change="handleFilter" />
        <button class="button is-info" @click="">Filter</button>
      </div>
    </div>

    <Pagination
      :currentPage="page"
      :totalPages="totalPages"
      @page-changed="(newPage) => {
        page = newPage
        updateForecasts()
        }"
    />

    <div v-for="forecast in forecasts" :key="forecast.id">
      <ForecastCard
        @remove="removeForecast"
        :forecast="forecast"
        :showRemoveButton="true"
      />
    </div>

    <AddForecastModal :isVisible="isModalVisible" @add="addForecast" @close="handleCloseModal" @error="handleError"/>

    <Pagination
      :currentPage="page"
      :totalPages="totalPages"
      @page-changed="(newPage) => {
        page = newPage
        updateForecasts()
        }"
    />

    <div v-if="hasErrors" class="notification is-danger" style="position: fixed; bottom: 1rem; right: 1rem; z-index: 1000; max-width: 400px;">
      <strong>Error:</strong>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@import "bulma";
</style>
