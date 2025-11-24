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

const forecasts = ref<WeatherForecast[]>([
  {
    id: '1',
    city: 'London',
    country: 'UK',
    temperature: 15,
    weatherCondition: 'Cloudy',
    weatherImage: '☁️',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    sunrise: '07:30',
    sunset: '16:45'
  }
])

function handleAddForecast() {

  
}

</script>

<template>
  <div id="app" style="display: flex; flex-direction: column; min-height: 100vh;">
    <ForecastCard
      v-for="forecast in forecasts"
      :key="forecast.id"
      :forecast="forecast"
    />

    <button class="button" onclick="handleAddForecast()">Add Forecast</button>

    <AddForecastModal :isVisible="true" />

    <!-- <div class="notification is-warning" style="margin: 1rem; align-self: end;">
      <strong>Warning:</strong>
      <p>This is a sample notification using Bulma CSS framework.</p>
    </div> -->
  </div>
</template>

<style lang="scss">
@import "bulma";
</style>
