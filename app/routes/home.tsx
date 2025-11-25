import type { Route } from "./+types/home";
import type { WeatherForecast } from "~/root";
import ForecastCard from "~/components/ForecastCard"
import AddForecastModal from "~/components/AddForecastModal";
import { fetchWeather, parseWeatherData } from "~/services/weatherApi";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather forecast app" },
    { name: "description", content: "Get the latest weather updates and forecasts." },
  ];
}



export default function Home() {
  const [forecast, setForecast] = useState<WeatherForecast>(new Object() as WeatherForecast);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchWeather("London")
      .then(data => {
        const weatherData = data.data;
        setForecast(parseWeatherData(weatherData));
        console.log(weatherData);
      })
      .catch(() => setForecast(null));
  }, []);

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

     <div  className="has-text-centered py-6">
       <div className="is-size-4">Loading forecasts...</div>
     </div>

     <div className="notification is-info has-text-centered">
       <p className="is-size-5">
         'No forecasts added yet. Click "Add Forecast" to get started!'
       </p>
     </div>

     <div className="forecast-grid">
       <ForecastCard forecast={forecast} showRemoveButton={false} />
     </div>

     <AddForecastModal isVisible={isModalVisible} onClose={handleCloseModal} onError={handleError}/>

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
