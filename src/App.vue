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
const allForecastQueries = ref<string[]>(localStorage.getItem('forecastQueries')
  ? JSON.parse(localStorage.getItem('forecastQueries') as string)
  : [])
const forecastQueries = ref<string[]>([...allForecastQueries.value])
const forecasts = ref<WeatherForecast[]>([])
const searchQuery = ref('')
const isModalVisible = ref(false)
const hasErrors = ref(false)
const errorMessage = ref("")
const isLoading = ref(false)
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
  searchQuery.value = filterValue
  page.value = 1

  await updateForecasts()
}

function clearSearch() {
  searchQuery.value = ''
  updateForecasts()
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
  allForecastQueries.value.push(forecast)
  localStorage.setItem('forecastQueries', JSON.stringify(allForecastQueries.value))
  updateForecasts()
}

function removeForecast(id: string) {
  const startIdx = (page.value - 1) * 10;

  const idx = startIdx + forecasts.value.findIndex(f => f.id === id)
  forecasts.value = forecasts.value.filter(f => f.id !== id)
  allForecastQueries.value.splice(idx, 1)
  
  console.log('Updated forecastQueries:', allForecastQueries.value)
  localStorage.setItem('forecastQueries', JSON.stringify(allForecastQueries.value))
  updateForecasts()
}

async function updateForecasts() {
  isLoading.value = true
  forecasts.value = []

  //TODO: by what to filter? queries can be city, coordinates or zip
  forecastQueries.value = allForecastQueries.value.filter(q =>
    q.toLowerCase().includes(searchQuery.value)
  )

  totalPages.value = Math.ceil(forecastQueries.value.length / recordsPerPage);

    const startIdx = (page.value - 1) * recordsPerPage;
    const endIdx = startIdx + recordsPerPage;
    forecastQueries.value = forecastQueries.value.slice(startIdx, endIdx);
    const promises = forecastQueries.value.map(q =>
      fetchWeather(q).then(data => {
        const forecast = parseWeatherData(data.data)

        forecasts.value.push(forecast)
      }).catch(error => {
        console.error(`Error fetching weather for ${q}:`, error)
        handleError(`Error fetching weather for ${q}: ${error.message}`)
      })
  )
  await Promise.all(promises)
  isLoading.value = false
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
  <div id="app" class="container p-4">
    <div class="level mb-5">
      <div class="level-left">
        <h1 class="title is-3">Weather Forecasts</h1>
      </div>
      <div class="level-right">
        <button class="button is-primary" @click="handleOpenForecast">Add Forecast</button>
      </div>
    </div>

    <div class="field has-addons mb-5">
      <div class="control is-expanded">
        <input 
          class="input" 
          type="text" 
          placeholder="Search by city, zip, or coordinates..." 
          v-model="searchQuery"
          @input="handleFilter" 
        />
      </div>
      <div class="control" v-if="searchQuery">
        <button class="button" @click="clearSearch" title="Clear search">✕</button>
      </div>
    </div>

    <Pagination
      v-if="totalPages > 1"
      :currentPage="page"
      :totalPages="totalPages"
      @page-changed="(newPage) => {
        page = newPage
        updateForecasts()
        }"
    />

    <div v-if="isLoading" class="has-text-centered py-6">
      <div class="is-size-4">Loading forecasts...</div>
    </div>

    <div v-else-if="forecasts.length === 0" class="notification is-info has-text-centered">
      <p class="is-size-5">
        {{ searchQuery ? 'No forecasts match your search.' : 'No forecasts added yet. Click "Add Forecast" to get started!' }}
      </p>
    </div>

    <div v-else class="forecast-grid">
      <ForecastCard
        v-for="forecast in forecasts" 
        :key="forecast.id"
        @remove="removeForecast"
        :forecast="forecast"
        :showRemoveButton="true"
      />
    </div>

    <AddForecastModal :isVisible="isModalVisible" @add="addForecast" @close="handleCloseModal" @error="handleError"/>

    <Pagination
      v-if="totalPages > 1 && forecasts.length > 0"
      :currentPage="page"
      :totalPages="totalPages"
      @page-changed="(newPage) => {
        page = newPage
        updateForecasts()
        }"
      class="mt-5"
    />

    <div v-if="hasErrors" class="notification is-danger error-toast">
      <button class="delete" @click="hasErrors = false"></button>
      <strong>Error:</strong>
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css";

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.error-toast {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
}
</style>
