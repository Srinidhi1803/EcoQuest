// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./AppLayout.jsx"; // ← matches your AppLayout file that imports ../AuthContext

// Core pages
import EcoQuestLanding from "./EcoQuestLanding.jsx";
import LearnPage from "./LearnPage.jsx";
import TriviaQuiz from "./TriviaQuiz.jsx";
import EcoAssistant from "./EcoAssistant.jsx";
import LeaderBoard from "./LeaderBoard.jsx";

// Auth pages (you shared these under src/pages)
import LoginPage from "./Aks/LoginPage.jsx";
import SignUpPage from "./Aks/SignUpPage.jsx";

// AKS folder pages
import HomePage from "./Aks/HomePage.jsx";
import ProfilePage from "./Aks/ProfilePage.jsx";
import GamesPage from "./Aks/GamesPage.jsx";
import WasteSortingGame from "./Aks/WasteSortingGame.jsx";
import EcoMemory from "./Aks/EcoMemory.jsx";
import PollutionCleanup from "./Aks/PollutionCleanup.jsx";
import PlanetDefender from "./Aks/PlanetDefender.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Shared layout (nav + header) */}
          <Route element={<AppLayout />}>
            {/* Public routes */}
            <Route index element={<EcoQuestLanding />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Private routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/trivia" element={<TriviaQuiz />} />
              <Route path="/quizzes" element={<TriviaQuiz />} />
              <Route path="/assistant" element={<EcoAssistant />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Games hub + individual games */}
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/waste-sorting" element={<WasteSortingGame />} />
              <Route path="/games/eco-memory" element={<EcoMemory />} />
              <Route path="/games/pollution-cleanup" element={<PollutionCleanup />} />
              <Route path="/games/planet-defender" element={<PlanetDefender />} />
              
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
