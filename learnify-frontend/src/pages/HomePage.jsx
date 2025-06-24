import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const [topic, setTopic] = useState("");
    const [hasNotes, setHasNotes] = useState(false);
    const [notes, setNotes] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file chosen");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : "No file chosen");
    };

    const handleSearch = () => {
        if (!topic.trim()) {
            alert("Please enter a topic! If you're just adding notes or attaching a file, just write \"the attached notes\" in the topic field.");
            return;
        }
        const formData = {
            topic,
            notes: hasNotes ? notes : null,
            file: hasNotes ? file : null,
        };
        navigate("/options", { state: formData });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div>
            <Navbar />
            <section className="hero-section">
                <div className="hero-container">
                    <h1 className="hero-title">
                        Learn Smarter, Not Harder
                    </h1>
                    <p className="hero-subtitle">
                        Transform your study materials into interactive flashcards, practice tests, and personalized study guides with the power of AI.
                    </p>
                    
                    <div className="search-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="topic-input">
                                What would you like to study?
                            </label>
                            <input
                                id="topic-input"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter a topic (e.g., Calculus, World History, Biology)"
                                className="search-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-container" htmlFor="notes-checkbox">
                                <input
                                    id="notes-checkbox"
                                    type="checkbox"
                                    checked={hasNotes}
                                    onChange={(e) => setHasNotes(e.target.checked)}
                                    className="checkbox"
                                />
                                <span className="checkbox-label">
                                    I have my own notes or materials to include
                                </span>
                            </label>
                        </div>

                        {hasNotes && (
                            <div className="notes-section">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="notes-textarea">
                                        Your Notes
                                    </label>
                                    <textarea
                                        id="notes-textarea"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Paste your notes here or upload a file below..."
                                        className="notes-textarea"
                                    />
                                </div>
                                
                                <div className="file-upload-section">
                                    <label className="form-label">
                                        Upload File (PDF)
                                    </label>
                                    <div className="file-upload-container">
                                        <input
                                            type="file"
                                            id="file-input"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="file-input" className="file-upload-button">
                                            Choose File
                                        </label>
                                        <span className={`file-chosen ${file ? 'has-file' : ''}`}>
                                            {fileName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={handleSearch} className="search-button">
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="features-container">
                    <h2 className="features-title">Powerful Study Tools</h2>
                    <p className="features-subtitle">
                        Everything you need to master any subject, powered by advanced AI technology.
                    </p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">🃏</span>
                            <h3 className="feature-title">Smart Flashcards</h3>
                            <p className="feature-description">
                                Generate interactive flashcards from any topic or your own notes. Perfect for memorization and quick review.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">📝</span>
                            <h3 className="feature-title">Practice Tests</h3>
                            <p className="feature-description">
                                Create comprehensive practice tests with multiple choice questions to test your knowledge and prepare for exams.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <span className="feature-icon">📚</span>
                            <h3 className="feature-title">Study Guides</h3>
                            <p className="feature-description">
                                Get personalized study plans broken down by days, with organized topics and key points to focus on.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;