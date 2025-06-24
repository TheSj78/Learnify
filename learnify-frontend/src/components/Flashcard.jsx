import React, { useState } from "react";
import "../styles/Flashcards.css";

export default function Flashcard({ flashcard, index, total, onPrev, onNext }) {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handlePrev = () => {
        setFlipped(false);
        onPrev();
    };

    const handleNext = () => {
        setFlipped(false);
        onNext();
    };

    return (
        <div className="flashcard-container">
            <div className="progress-indicator">
                Card {index + 1} of {total}
            </div>
            
            <div
                className={`flashcard ${flipped ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                <div className="flashcard-inner">
                    <div className="flashcard-front">
                        <div className="flashcard-content">
                            {flashcard.question}
                        </div>
                    </div>
                    <div className="flashcard-back">
                        <div className="flashcard-content">
                            {flashcard.answer}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flip-hint">
                Click the card to flip it
            </div>
            
            <div className="flashcard-navigation">
                <button 
                    className="nav-button prev-button" 
                    onClick={handlePrev} 
                    disabled={index === 0}
                >
                    ← Previous
                </button>
                <button 
                    className="nav-button next-button" 
                    onClick={handleNext} 
                    disabled={index === total - 1}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}