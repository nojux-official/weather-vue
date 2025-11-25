import type { Route } from "./+types/home";
// import { WeatherForecast } from "~/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather forecast app" },
    { name: "description", content: "Get the latest weather updates and forecasts." },
  ];
}

export default function Home() {
  return (
    <div id="app" className="container p-4">
      <div className="level mb-5">
        <div className="level-left">
          <h1 className="title is-3">Weather Forecasts</h1>
        </div>
        <div className="level-right">
          <button className="button is-primary">Add Forecast</button>
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

     <div v-else-if="forecasts.length === 0" className="notification is-info has-text-centered">
       <p className="is-size-5">
         'No forecasts added yet. Click "Add Forecast" to get started!'
       </p>
     </div>

     <div  className="forecast-grid">
       //forecast card
     </div>

     {/* <AddForecastModal :isVisible="isModalVisible" @add="addForecast" @close="handleCloseModal" @error="handleError"/> */}

    //pagination here

     <div  className="notification is-danger error-toast">
       <button className="delete"></button>
       <strong>Error:</strong>
       <p>Error</p>
     </div>
  </div>
  );
}
