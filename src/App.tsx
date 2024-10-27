import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vacancies from './pages/Vacancies';
import VacancyDetails from './pages/VacancyDetails';
import Candidates from './pages/Candidates';
import CandidateProfile from './pages/CandidateProfile';
import Interviews from './pages/Interviews';
import Settings from './pages/Settings';
import { Brain } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Aldebaran Insight</h1>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/vacancies/:id" element={<VacancyDetails />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;