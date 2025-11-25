import { useState } from "react";
import type { WeatherForecast } from "~/root";
import ForecastCard from "~/components/ForecastCard";
import { fetchWeather, parseWeatherData } from "~/services/weatherApi";

interface AddForecastModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (forecast: string) => void;
  onError: (message: string) => void;
}

export default function AddForecastModal({
  isVisible,
  onClose,
  onAdd,
  onError,
}: AddForecastModalProps) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchQuery(value);

    if (!value) {
      setForecast(null);
      return;
    }

    setIsSearching(true);
    fetchWeather(value)
      .then((data) => {
        const parsedForecast = parseWeatherData(data.data);
        setForecast(parsedForecast);
      })
      .catch((error) => {
        setForecast(null);
        const errorMessage =
          error.response?.data?.message || error.message || "Unknown error";
        const errorCode =
          error.response?.data?.cod || error.response?.status || "N/A";
        onError(`Error (${errorCode}) for ${value}: ${errorMessage}`);
      })
      .finally(() => setIsSearching(false));
  }

  function handleAdd() {
    if (forecast && searchQuery) {
      onAdd(searchQuery);
      onClose();
      setForecast(null);
      setSearchQuery("");
    }
  }

  if (!isVisible) return null;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Add Weather Forecast</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>

        <section className="modal-card-body">
          <div className="field mb-5">
            <label className="label">Location</label>
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                placeholder="City, coordinates (lat,lon), or zip code"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <p className="help">Press Enter or click away to search</p>
          </div>

          {isSearching ? (
            <div className="has-text-centered py-5">
              <p className="has-text-grey">Searching...</p>
            </div>
          ) : forecast ? (
            <div className="preview-section">
              <p className="subtitle is-6 mb-3">Preview:</p>
              <ForecastCard forecast={forecast} />
            </div>
          ) : searchQuery ? (
            <div className="has-text-centered py-5">
              <p className="has-text-grey">No forecast found.</p>
            </div>
          ) : null}
        </section>

        <footer className="modal-card-foot" style={{ justifyContent: "space-between" }}>
          <button className="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button is-primary"
            disabled={!forecast}
            onClick={handleAdd}
          >
            Add Forecast
          </button>
        </footer>
      </div>
    </div>
  );
}