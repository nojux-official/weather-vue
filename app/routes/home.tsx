import type { Route } from "./+types/home";
import type { WeatherForecast } from "~/root";
import ForecastCard from "~/components/ForecastCard"
import AddForecastModal from "~/components/AddForecastModal";
import Pagination from "~/components/Pagination";
import { fetchWeather, parseWeatherData } from "~/services/weatherApi";
import { use, useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather forecast app" },
    { name: "description", content: "Get the latest weather updates and forecasts." },
  ];
}


const updateIntervalTime = 10 * 1000; //ms
const recordsPerPage = 10;


export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [allForecastQueries, setAllForecastQueries] = useState<string[]>([]);
  const [forecastQueries, setForecastQueries] = useState<string[]>([]);
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFilter(event: Event) {
    const target = event.target as HTMLInputElement
    const filterValue = target.value.toLowerCase()
    setSearchQuery(filterValue)
    // page.value = 1

    await updateForecasts()
  }

  function clearSearch() {
    setSearchQuery('')
    updateForecasts()
  }
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

  function handlePageChange(newPage: number){
    setPage(newPage)
    updateForecasts()
  }

  function addForecast(forecast: string) {
    setAllForecastQueries(prev => {
      const updated = [...prev, forecast];
      localStorage.setItem('forecastQueries', JSON.stringify(updated));
      return updated;
    });
    updateForecasts();
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
    updateForecasts();
  }


  async function updateForecasts() {
    setIsLoading(true)
    setForecasts([])

    //TODO: by what to filter? queries can be city, coordinates or zip
    let filteredQueries = allForecastQueries.filter(q =>
      q.toLowerCase().includes(searchQuery)
    )

    setTotalPages(Math.ceil(filteredQueries.length / recordsPerPage))

    const startIdx = (page - 1) * recordsPerPage;
    filteredQueries = filteredQueries.splice(startIdx, startIdx + recordsPerPage)

    const promises = filteredQueries.map(q =>
      fetchWeather(q).then(data => {
        const forecast = parseWeatherData(data.data)
        return forecast;
      }).catch(error => {
        console.error(`Error fetching weather for ${q}:`, error)
        handleError(`Error fetching weather for ${q}: ${error.message}`)
        return null;
      })
    )
    const results = await Promise.all(promises)
    setForecasts(results)
    setIsLoading(false)
  }

  useEffect(() => {
    const storedQueries = localStorage.getItem('forecastQueries');
    const parsed = storedQueries ? JSON.parse(storedQueries) : [];
    setAllForecastQueries(parsed);
  }, []);

  useEffect(() => {
    console.log('Loaded stored forecast queries:', allForecastQueries);
    updateForecasts();
  }, [allForecastQueries, searchQuery]);


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

    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}/> 

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

    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}/>


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
