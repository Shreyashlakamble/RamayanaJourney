import { ThemeProvider } from './contexts/ThemeContext'
import { LocationProvider } from './contexts/LocationContext'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AppRouter />
      </LocationProvider>
    </ThemeProvider>
  )
}

export default App