import { Routes, Route } from 'react-router-dom'
import PalettePreview from './components/PalettePreview'
import NotFound from './pages/NotFound'

// App holds the route map. It grows as phases land: auth pages (Phase 1),
// gameplay views behind a protected layout (Phase 2), the admin group (Phase 4).
// For now "/" shows the temporary palette preview.
function App() {
  return (
    <Routes>
      <Route path="/" element={<PalettePreview />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
