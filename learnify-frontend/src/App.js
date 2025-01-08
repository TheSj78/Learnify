import React from "react";
import HomePage from "./pages/HomePage";
import Options from "./pages/Options";
import NotFound from "./pages/NotFound";
import Flashcards from "./pages/Flashcards";
import PracticeTestGenerator from "./pages/PracticeTestGenerator";
import StudyGuideGenerator from "./pages/StudyGuideGenerator";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/options" element={<Options />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/practice-test" element={<PracticeTestGenerator />} />
                <Route path="/study-guide" element={<StudyGuideGenerator />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
