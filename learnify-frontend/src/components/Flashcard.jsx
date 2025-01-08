import React, { useState } from "react";
import "../styles/Flashcard.css";

export default function Flashcard({ flashcard, index, total, onPrev, onNext }) {
    const [flipped, setFlipped] = useState(false);
    const [className, setClassName] = useState("flashcard");

    const handleFlip = () => {
        setFlipped(!flipped);
        flipped ? setClassName("flashcard") : setClassName("flashcard flipped");
    };

    const goPrev = () => {
        setFlipped(false);
        setClassName("flashcard");
        onPrev();
        //wait for 200ms before calling onPrev
        // setTimeout(() => onPrev(), 500);
        // onPrev();
    }

    const goNext = () => {
        setFlipped(false);
        setClassName("flashcard");
        onNext();
    }

    return (
        <div className="flashcard-container">
            <div
                className={className}
                onClick={handleFlip}
            >
                <div className="front">
                    <h3>{flashcard.question}</h3>
                </div>
                <div className="back">
                    <h3>{flashcard.answer}</h3>
                </div>
            </div>
            <div className="navigation">
                <button onClick={goPrev} disabled={index === 0}>
                    &lt; Prev
                </button>
                <button onClick={goNext} disabled={index === total - 1}>
                    Next &gt;
                </button>
            </div>
        </div>
    );
}