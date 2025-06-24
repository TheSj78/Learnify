import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Options.css";

const Options = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, notes, file } = location.state || {};

    const options = [
        {
            id: 'flashcards',
            icon: '🃏',
            title: 'Generate Flashcards',
            description: 'Create interactive flashcards for quick review and memorization. Perfect for vocabulary, definitions, and key concepts.',
            path: '/flashcards',
            className: 'flashcards-card'
        },
        {
            id: 'practice-test',
            icon: '📝',
            title: 'Generate Practice Test',
            description: 'Build comprehensive multiple-choice tests to assess your knowledge and prepare for exams.',
            path: '/practice-test',
            className: 'practice-test-card'
        },
        {
            id: 'study-guide',
            icon: '📚',
            title: 'Generate Study Guide',
            description: 'Get a personalized study plan with organized topics and daily schedules to maximize your learning.',
            path: '/study-guide',
            className: 'study-guide-card'
        }
    ];

    const handleOptionClick = (path) => {
        navigate(path, {
            state: { topic, notes, file }
        });
    };

    return (
        <div className="options-page">
            <Navbar />
            <div className="options-container">
                <div className="options-header">
                    <h1 className="options-title">Choose Your Study Tool</h1>
                    <p className="options-subtitle">
                        Select how you'd like to study your topic
                    </p>
                    <div className="topic-badge">
                        {topic}
                    </div>
                </div>

                <div className="options-grid">
                    {options.map((option) => (
                        <div 
                            key={option.id}
                            className={`option-card ${option.className}`}
                            onClick={() => handleOptionClick(option.path)}
                        >
                            <span className="option-icon">{option.icon}</span>
                            <h3 className="option-title">{option.title}</h3>
                            <p className="option-description">{option.description}</p>
                            <button className="option-button">
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>

                <div className="back-section">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Options;