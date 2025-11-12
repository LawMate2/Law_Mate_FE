import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RecommendedPromptsPage from './pages/RecommendedPromptsPage'
import RecentConversationsPage from './pages/RecentConversationsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecommendedPromptsPage />} />
        <Route path="/recent" element={<RecentConversationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
