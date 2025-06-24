import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateFlashcards } from "../services/api";
import Flashcard from "../components/Flashcard";
import "../styles/Flashcards.css";

const Flashcards = () => {
    const [numFlashcards, setNumFlashcards] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, notes, file } = location.state || {};

    const handleGenerate = async () => {
        if (!numFlashcards) {
            alert("Please enter the number of flashcards.");
            return;
        }
        if (numFlashcards < 1 || numFlashcards > 20) {
            alert("Please enter a number between 1 and 20.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('topic', topic);
            formData.append("notes", notes || "");
            formData.append("file", file || "");
            formData.append("numFlashcards", numFlashcards);

            var data = await generateFlashcards(formData);
            
            console.log(typeof data);
            console.log(data);
            if (typeof data === "string") {
                if (data.substring(0, 7) === "```json") {
                    data = data.substring(7);
                    data = data.substring(0, data.length - 3);
                }
                data = JSON.parse(data);
            }
            setResults(data);
        } catch (error) {
            console.error("Error generating flashcards:", error);
            setResults([{
                id: 1,
                question: "Error generating flashcards",
                answer: "Please try again or contact support if the issue persists."
            }]);
        }

        setLoading(false);
    };

    const handleRegenerate = () => {
        setResults([]);
        setNumFlashcards("");
        setCurrentIndex(0);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < results.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleGenerate();
        }
    };

    return (
        <div className="flashcards-page">
            <Navbar />
            <div className="flashcards-container">
                {loading ? (
                    <div className="loading">
                        Generating your flashcards...
                    </div>
                ) : (
                    <>
                        {results.length === 0 ? (
                            <>
                                <div className="flashcards-header">
                                    <h1 className="flashcards-title">
                                        Generate Flashcards
                                    </h1>
                                    <p className="flashcards-subtitle">
                                        Create interactive flashcards for <strong>{topic}</strong>
                                    </p>
                                </div>

                                <div className="generation-form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="num-flashcards">
                                            How many flashcards would you like? (1-20)
                                        </label>
                                        <input
                                            id="num-flashcards"
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={numFlashcards}
                                            onChange={(e) => setNumFlashcards(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter number of flashcards"
                                            className="number-input"
                                        />
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        className="generate-button"
                                    >
                                        Generate Flashcards
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flashcard-study-section">
                                <div className="study-header">
                                    <h2 className="study-title">Study Time! 🎯</h2>
                                    <p className="study-subtitle">
                                        Review your flashcards for <strong>{topic}</strong>
                                    </p>
                                </div>

                                <Flashcard
                                    flashcard={results[currentIndex]}
                                    index={currentIndex}
                                    total={results.length}
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                />

                                <div className="action-buttons">
                                    <button onClick={handleRegenerate} className="regenerate-button">
                                        Generate New Set
                                    </button>
                                    <button onClick={handleBack} className="back-button">
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Flashcards;