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
        setFile(e.target.files[0]);
		setFileName(e.target.files[0].name);
    };

    const handleSearch = () => {
        if (!topic) {
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

    return (
        <div>
            <Navbar />
            <div className="container">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => {
                        e.key === "Enter" && handleSearch();
                    }}
                    placeholder="Enter a topic"
                    className="input"
                />
                <div className="checkbox-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={hasNotes}
                            onChange={(e) => setHasNotes(e.target.checked)}
                            className="check"
                        />
                        Do you have your own notes to input?
                    </label>
                </div>
                {hasNotes && (
                    <div className="notes-container">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter or paste your notes here"
                            className="textarea"
                        />
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="actual-btn"
                                hidden
                                onChange={handleFileChange}
                            />
                            <label htmlFor="actual-btn" className="custom-file-upload">
                                Choose File
                            </label>
                            <span id="file-chosen">{fileName}</span>
                        </div>
                    </div>
                )}
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
        </div>
    );
};

export default HomePage;
