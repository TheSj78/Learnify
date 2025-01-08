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
            /*
            const data = [
                {
                    id: 1,
                    question: "What is the derivative of x^n?",
                    answer: "nx^(n-1)",
                },
                {
                    id: 2,
                    question: "What is the integral of x^n?",
                    answer: "(x^(n+1))/(n+1) + C (where C is the constant of integration)",
                },
                {
                    id: 3,
                    question: "What is the chain rule for differentiation?",
                    answer: "The derivative of f(g(x)) is f'(g(x)) * g'(x)",
                },
            ];
            */
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
            setResults("An error occurred while generating flashcards.");
        }

        setLoading(false);
    };

    const handleRegenerate = () => {
        setResults([]);
        setNumFlashcards("");
        setCurrentIndex(0);
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
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


    return (
        <div>
            <Navbar />
            <div className="flashcards-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {results.length === 0 ? (
                            <>
                                <h1>Generate Flashcards</h1>
                                <input
                                    type="number"
                                    value={numFlashcards}
                                    onChange={(e) =>
                                        setNumFlashcards(e.target.value)
                                    }
                                    placeholder="Number of flashcards"
                                    className="input"
                                    onKeyDown={(e) => {
                                        e.key === "Enter" && handleGenerate();
                                    }}
                                />
                                <button
                                    onClick={handleGenerate}
                                    className="generate-button"
                                >
                                    Generate
                                </button>
                            </>
                        ) : (
                            <>
                                <h3>Good luck!</h3>
                                <Flashcard
                                    flashcard={results[currentIndex]}
                                    index={currentIndex}
                                    total={results.length}
                                    onPrev={handlePrev}
                                    onNext={handleNext}
                                />
                                <button onClick={handleRegenerate} className="regenerate-button">
                                    Regenerate
                                </button>
                            </>
                        )}
                        <button onClick={handleBack} className="back-button">
                            Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
