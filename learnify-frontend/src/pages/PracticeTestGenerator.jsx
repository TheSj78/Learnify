import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generatePracticeTest } from "../services/api";
import PracticeTestPDF from "../components/PracticeTestPDF";
import { pdf } from '@react-pdf/renderer';
import "../styles/PracticeTest.css";

const PracticeTestGenerator = () => {
    const [numQuestions, setNumQuestions] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
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

    function ensureQuotesAroundValues(jsonStr) {
        return jsonStr.replace(/:\s*([^",\}\{\]\s]+)(\s*[,\}\]])/g, (match, p1, p2) => {
            if (!p1.startsWith('"')) {
                p1 = `"${p1}"`;
            }
            return `: ${p1}${p2}`;
        });
    }

    const handleGenerate = async () => {
        if (!numQuestions) {
            alert("Please enter the number of questions.");
            return;
        }
        if (numQuestions < 1 || numQuestions > 50) {
            alert("Please enter a number between 1 and 50.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("topic", topic);
            formData.append("numQuestions", numQuestions);
            formData.append("file", file || "");
            formData.append("notes", notes || "");

            var data = await generatePracticeTest(formData);
            console.log(data);
            console.log(typeof data);

            if (typeof data === "string") {
                if (data.substring(0, 7) === "```json") {
                    data = data.substring(7);
                    data = data.substring(0, data.length - 3);
                }

                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = ensureQuotesAroundValues(data);
                    try {
                        data = JSON.parse(data);
                    } catch (e2) {
                        data = data.replace(/:\s*("?[^",\}\{]*"?)(\s*[,\}])/g, (match, p1, p2) => {
                            if (!/^".*"$/.test(p1)) {
                                p1 = `"${p1}"`;
                            }
                            return `: ${p1}${p2}`;
                        });

                        try {
                            data = JSON.parse(data);
                        } catch (e3) {
                            console.error("Error parsing JSON:", e3);
                            setError("An error occurred while generating the practice test.");
                            return;
                        }
                    }
                }
            }
            
            data = replaceSymbolsInArray(data);
            setQuestions(data);

            const pdfBlob = await pdf(<PracticeTestPDF questions={JSON.parse(JSON.stringify(data))} />).toBlob();
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error generating practice test:", error);
            setError("An error occurred while generating the practice test. Please try again.");
            setQuestions([]);
            setPdfUrl(null);
        }

        setLoading(false);
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${topic}-practice-test.pdf`;
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
        <div className="practice-test-page">
            <Navbar />
            <div className="practice-test-container">
                {loading ? (
                    <div className="loading">
                        <div className="loading-text">Generating your practice test...</div>
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
                        ) : questions.length === 0 ? (
                            <>
                                <div className="practice-test-header">
                                    <h1 className="practice-test-title">
                                        Generate Practice Test
                                    </h1>
                                    <p className="practice-test-subtitle">
                                        Create a comprehensive practice test for <strong>{topic}</strong>
                                    </p>
                                </div>

                                <div className="generation-form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="num-questions">
                                            How many questions would you like? (1-50)
                                        </label>
                                        <input
                                            id="num-questions"
                                            type="number"
                                            min="1"
                                            max="50"
                                            value={numQuestions}
                                            onChange={(e) => setNumQuestions(e.target.value)}
                                            onKeyDown={handleKeyPress}
                                            placeholder="Enter number of questions"
                                            className="number-input"
                                        />
                                    </div>
                                    <button
                                        onClick={handleGenerate}
                                        className="generate-button"
                                    >
                                        Generate Practice Test
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pdf-viewer-section">
                                <div className="pdf-header">
                                    <div className="pdf-title">
                                        Your Practice Test
                                    </div>
                                    <div className="pdf-actions">
                                        <button onClick={handleDownload} className="download-button">
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                                {pdfUrl && (
                                    <iframe
                                        title="Practice Test"
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

export default PracticeTestGenerator;