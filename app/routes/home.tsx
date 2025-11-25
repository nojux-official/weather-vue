import type { Route } from "./+types/home";
import type { WeatherForecast } from "~/root";
import ForecastCard from "~/components/ForecastCard"
import AddForecastModal from "~/components/AddForecastModal";
import { fetchWeather, parseWeatherData } from "~/services/weatherApi";
import { useEffect, useState } from "react";
import { updateCache } from "axios-cache-interceptor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather forecast app" },
    { name: "description", content: "Get the latest weather updates and forecasts." },
  ];
}



export default function Home() {
  const [allForecastQueries, setAllForecastQueries] = useState<string[]>(() => {
    const storedQueries = localStorage.getItem('forecastQueries');
    return storedQueries ? JSON.parse(storedQueries) : [];
  });
  const [forecastQueries, setForecastQueries] = useState<string[]>(allForecastQueries);
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  function handleOpenForecast() {
    setIsModalVisible(true);
  }
  function handleCloseModal() {
    setIsModalVisible(false);
  }

  function handleError(message: string) {
      setHasErrors(true)
      setErrorMessage(message)
      setTimeout(() => {
        setHasErrors(false)
        setErrorMessage("")
    }, 5000)
  }

  function addForecast(forecast: string) {
    setAllForecastQueries(prev => {
      const updated = [...prev, forecast];
      localStorage.setItem('forecastQueries', JSON.stringify(updated));
      return updated;
    });
    // updateForecasts();
  }

  function removeForecast(id: string) {
    const startIdx = 0 //(page.value - 1) * 10;

    const idx = startIdx + forecasts.findIndex(f => f.id === id)
    setForecasts(forecasts.filter(f => f.id !== id))
    setAllForecastQueries(prev => {
      const updated = [...prev];
      updated.splice(idx, 1);
      localStorage.setItem('forecastQueries', JSON.stringify(updated));
      return updated;
    });
    // updateForecasts();
  }


  return (
    <div id="app" className="container p-4">
      <div className="level mb-5">
        <div className="level-left">
          <h1 className="title is-3">Weather Forecasts</h1>
        </div>
        <div className="level-right">
          <button className="button is-primary" onClick={handleOpenForecast}>Add Forecast</button>
        </div>
      </div>

     <div className="field has-addons mb-5">
       <div className="control is-expanded">
         <input 
           className="input" 
           type="text" 
           placeholder="Search by city, zip, or coordinates..." 
           v-model="searchQuery"
         />
       </div>
       <div className="control">
         <button className="button" title="Clear search">✕</button>
       </div>
     </div>

     //Pagination controls here

    {isLoading && (
     <div  className="has-text-centered py-6">
       <div className="is-size-4">Loading forecasts...</div>
     </div>
    )}

    {forecasts.length === 0 && (
     <div className="notification is-info has-text-centered">
       <p className="is-size-5">
        
         'No forecasts added yet. Click "Add Forecast" to get started!'
       </p>
     </div>
    )}

     <div className="forecast-grid">
      {forecasts.map(forecast => (
        <ForecastCard 
          key={forecast.id}
          forecast={forecast} 
          showRemoveButton={false} 
        />
      ))}
     </div>

     <AddForecastModal isVisible={isModalVisible} onAdd={addForecast} onClose={handleCloseModal} onError={handleError}/>

    //pagination here

    {hasErrors && (
     <div  className="notification is-danger error-toast">
       <button className="delete"></button>
       <strong>Error:</strong>
       <p>{errorMessage}</p>
     </div>
    )}
  </div>
  );
}
