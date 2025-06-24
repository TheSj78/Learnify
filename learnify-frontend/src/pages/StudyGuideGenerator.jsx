import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateStudyGuide } from "../services/api";
import StudyGuidePDF from "../components/StudyGuidePDF";
import { pdf } from '@react-pdf/renderer';
import "../styles/StudyGuide.css";

const StudyGuideGenerator = () => {
    const [numDays, setNumDays] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, notes, file } = location.state || {};

    const symbolMap = {
        'π': 'pi',
        '∫': 'integral',
        '√': 'sqrt',
        '∞': 'infinity',
        'Σ': 'sum',
    };

    function replaceSymbolsInString(str) {
        return str.replace(/[π∫√∞Σ]/g, (match) => symbolMap[match] || match);
    }

    function replaceSymbolsInObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replaceSymbolsInString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceSymbolsInObject(obj[key]);
            }
        }
        return obj;
    }

    function replaceSymbolsInArray(arr) {
        return arr.map(item => {
            if (typeof item === 'object' && item !== null) {
                return replaceSymbolsInObject(item);
            } else if (typeof item === 'string') {
                return replaceSymbolsInString(item);
            }
            return item;
        });
    }

    const handleGenerate = async () => {
        if (!numDays) {
            alert("Please enter the number of days.");
            return;
        }
        if (numDays < 1 || numDays > 30) {
            alert("Please enter a number between 1 and 30.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("topic", topic);
            formData.append("numDays", numDays);
            formData.append("file", file || "");
            formData.append("notes", notes || "");

            let data = await generateStudyGuide(formData);
            console.log(data);
            console.log(typeof data);

            if (typeof data === "string") {
                if (data.substring(0, 7) === "```json") {
                    data = data.substring(7);
                    data = data.substring(0, data.length - 3);
                }
                data = JSON.parse(data);
            }
            
            data = replaceSymbolsInArray(data);
            setContent(data);

            const pdfBlob = await pdf(<StudyGuidePDF content={JSON.parse(JSON.stringify(data))} />).toBlob();
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error generating study guide:", error);
            setError("An error occurred while generating the study guide. Please try again.");
            setContent([]);
            setPdfUrl(null);
        }

        setLoading(false);
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${topic}-study-guide.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleGenerate();
        }
    };

    return (
        <div className="study-guide-page">
            <Navbar />
            <div className="study-guide-container">
                {loading ? (
                    <div className="loading">
                        <div className="loading-text">Creating your personalized study guide...</div>
                        <div className="loading-subtext">This may take a few moments</div>
                    </div>
                ) : (
                    <>
                        {error ? (
                            <div className="error">
                                <div className="error-icon">⚠️</div>
                                <div className="error-title">Generation Failed</div>
                                <div className="error-message">{error}</div>
                            </div>
                        ) : content.length === 0 ? (
                            <>
                                <div className="study-guide-header">
                                    <h1 className="study-guide-title">
                                        Generate Study Guide
                                    </h1>
                                    <p className="study-guide-subtitle">
                                        Create a personalized study plan for <strong>{topic}</strong>
                                    </p>
                                </div>

                                <div className="generation-form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="num-days">
                                            How many days do you have to study? (1-30)
                                        </label>
                                        <input
                                            id="num-days"
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={numDays}
                                            onChange={(e) => setNumDays(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter number of study days"
                                            className="number-input"
                                        />
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        className="generate-button"
                                    >
                                        Generate Study Guide
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pdf-viewer-section">
                                <div className="pdf-header">
                                    <div className="pdf-title">
                                        Your Study Guide
                                    </div>
                                    <div className="pdf-actions">
                                        <button onClick={handleDownload} className="download-button">
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                                {pdfUrl && (
                                    <iframe
                                        title="Study Guide"
                                        src={pdfUrl}
                                        className="pdf-viewer"
                                    />
                                )}
                            </div>
                        )}
                        
                        <div className="back-section">
                            <button onClick={handleBack} className="back-button">
                                Back
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudyGuideGenerator;