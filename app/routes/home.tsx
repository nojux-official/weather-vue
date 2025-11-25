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


export default function Home() {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [allForecastQueries, setAllForecastQueries] = useState<string[]>([]);
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  /*
dP     dP   .d888888  888888ba  888888ba  dP         88888888b  888888ba  .d88888b  
88     88  d8'    88  88    `8b 88    `8b 88         88         88    `8b 88.    "' 
88aaaaa88a 88aaaaa88a 88     88 88     88 88        a88aaaa    a88aaaa8P' `Y88888b. 
88     88  88     88  88     88 88     88 88         88         88   `8b.       `8b 
88     88  88     88  88     88 88    .8P 88         88         88     88 d8'   .8P 
dP     dP  88     88  dP     dP 8888888P  88888888P  88888888P  dP     dP  Y88888P  
                                                                                    
                                                                                    
*/
  function clearSearch() {
    setSearchQuery('')
    setPage(1) // Reset to first page
  }

  function handleOpenForecast() {
    setIsModalVisible(true);
  }
  function handleCloseModal() {
    setIsModalVisible(false);
  }

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const filterValue = event.target.value
    setSearchQuery(filterValue)
    setPage(1) // Reset to first page when searching
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

  /*
dP     dP d888888P dP dP        
88     88    88    88 88        
88     88    88    88 88        
88     88    88    88 88        
Y8.   .8P    88    88 88        
`Y88888P'    dP    dP 88888888P 
                                
                                
*/

  function addForecast(forecast: string) {
    setAllForecastQueries(prev => {
      const updated = [...prev, forecast];
      localStorage.setItem('forecastQueries', JSON.stringify(updated));
      return updated;
    });
    updateForecasts();
  }

  function removeForecast(id: string) {
    const startIdx = (page - 1) * 10;

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

    let filteredQueries = allForecastQueries.filter(q =>
      q.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setTotalPages(Math.ceil(filteredQueries.length / recordsPerPage))

    const startIdx = (page - 1) * recordsPerPage;
    const paginatedQueries = filteredQueries.slice(startIdx, startIdx + recordsPerPage) // Use slice, not splice

    const promises = paginatedQueries.map(q =>
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
    const validForecasts = results.filter(forecast => forecast !== null) // Filter out null results
    setForecasts(validForecasts)
    setIsLoading(false)
  }

  // LOCAL STORAGE
  useEffect(() => {
    const storedQueries = localStorage.getItem('forecastQueries');
    const parsed = storedQueries ? JSON.parse(storedQueries) : [];
    setAllForecastQueries(parsed);
  }, []);

  // UPDATE ON INTERACTION
  useEffect(() => {
    if (allForecastQueries.length > 0) {
      console.log('Loaded stored forecast queries:', allForecastQueries);
      updateForecasts();
    }
  }, [allForecastQueries, searchQuery, page]);

  // AUTO UPDATE
  useEffect(() => {
    const interval = setInterval(() => {
      if (allForecastQueries.length > 0) {
        updateForecasts();
      }
    }, updateIntervalTime);

    return () => clearInterval(interval);
  }, [allForecastQueries]);

  /*
d888888P  88888888b 8888ba.88ba   888888ba  dP         .d888888  d888888P  88888888b 
   88     88        88  `8b  `8b  88    `8b 88        d8'    88     88     88        
   88    a88aaaa    88   88   88 a88aaaa8P' 88        88aaaaa88a    88    a88aaaa    
   88     88        88   88   88  88        88        88     88     88     88        
   88     88        88   88   88  88        88        88     88     88     88        
   dP     88888888P dP   dP   dP  dP        88888888P 88     88     dP     88888888P 
                                                                                     
                                                                                     
*/

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
           value={searchQuery}
           onChange={handleFilter}
         />
       </div>
       <div className="control">
         <button className="button" title="Clear search" onClick={clearSearch}>✕</button>
       </div>
     </div>

    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}/> 

    {isLoading && (
     <div  className="has-text-centered py-6">
       <div className="is-size-4">Loading forecasts...</div>
     </div>
    )}

    {!isLoading && allForecastQueries.length === 0 && (
     <div className="notification is-info has-text-centered">
       <p className="is-size-5">
        
          No forecasts added yet. Click "Add Forecast" to get started!
       </p>
     </div>
    )}

     <div className="forecast-grid">
      {forecasts.map(forecast => (
        <ForecastCard 
          key={forecast.id}
          forecast={forecast} 
          showRemoveButton={true} 
          onRemove={removeForecast}
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
