import type { WeatherForecast } from '~/root.tsx'

interface ForecastCardProps {
  forecast: WeatherForecast;
  showRemoveButton?: boolean;
  onRemove: (id: string) => void;
}

export default function ForecastCard({ forecast, showRemoveButton, onRemove }: ForecastCardProps) {
  return (
    <div className="card forecast-tile">
      <div className="card-image has-text-centered pt-4">
        <img src={forecast.weatherImage} alt={forecast.weatherCondition} className="weather-icon" />
      </div>
      <div className="card-content">
        <div className="has-text-centered mb-3">
          <p className="title is-5 mb-1">{ forecast.city }</p>
          <p className="subtitle is-6 mb-2">{ forecast.country }</p>
          <p className="is-size-7 has-text-grey">{ forecast.weatherCondition }</p>
        </div>
        
        <div className="has-text-centered py-4 temp-section">
          <p className="is-size-2 has-text-weight-bold">{ forecast.temperature }°C</p>
        </div>

        <div className="content is-small">
          <div className="level is-mobile mb-2">
            <div className="level-left has-text-grey">💧 Humidity:</div>
            <div className="level-right has-text-weight-semibold">{ forecast.humidity }%</div>
          </div>
          <div className="level is-mobile mb-2">
            <div className="level-left has-text-grey">💨 Wind:</div>
            <div className="level-right has-text-weight-semibold">{ forecast.windSpeed } km/h</div>
          </div>
          <div className="level is-mobile mb-2">
            <div className="level-left has-text-grey">🎚️ Pressure:</div>
            <div className="level-right has-text-weight-semibold">{ forecast.pressure } hPa</div>
          </div>
          <div className="level is-mobile mb-2">
            <div className="level-left has-text-grey">🌅 Sunrise:</div>
            <div className="level-right has-text-weight-semibold">{ forecast.sunrise }</div>
          </div>
          <div className="level is-mobile mb-2">
            <div className="level-left has-text-grey">🌇 Sunset:</div>
            <div className="level-right has-text-weight-semibold">{ forecast.sunset }</div>
          </div>
        </div>
      </div>
      {showRemoveButton && (
      <footer className="card-footer">
        <a className="card-footer-item has-text-danger" onClick={() => onRemove(forecast.id)}>
          Remove
        </a>
      </footer>
      )}
    </div>
  )
}