import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import JourneyPage from '../pages/JourneyPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<JourneyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter