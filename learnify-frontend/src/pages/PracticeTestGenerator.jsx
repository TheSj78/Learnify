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
    const [q, setQ] = useState([]);
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
        // Add more symbols and their replacements as needed
    };

    function replaceSymbolsInString(str) {
        return str.replace(/[π∫√∞Σ]/g, (match) => symbolMap[match] || match);
    }

    function replaceSymbolsInObject(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replaceSymbolsInString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                replaceSymbolsInObject(obj[key]); // Recursively replace symbols in nested objects or arrays
            }
        }
        return obj;
    }

    function replaceSymbolsInArray(arr) {
        return arr.map(item => {
            if (typeof item === 'object' && item !== null) {
                return replaceSymbolsInObject(item); // Process each object in the array
            } else if (typeof item === 'string') {
                return replaceSymbolsInString(item); // Handle strings directly within the array
            }
            return item; // Return non-object, non-string items as is
        });
    }

    function ensureQuotesAroundValues(jsonStr) {
        // Ensure all values are enclosed in double quotes
        return jsonStr.replace(/:\s*([^",\}\{\]\s]+)(\s*[,\}\]])/g, (match, p1, p2) => {
            // Wrap the value in quotes if it doesn't already start with a quote
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
        setError(null); // Reset the error state

        try {
            const formData = new FormData();
            formData.append("topic", topic);
            formData.append("numQuestions", numQuestions);
            formData.append("file", file || "");
            formData.append("notes", notes || "");

            var data = await generatePracticeTest(formData);
            console.log(data);
            console.log("=====================================");
            console.log(typeof data);

            if (typeof data === "string") {
                if (data.substring(0, 7) === "```json") {
                    data = data.substring(7);
                    data = data.substring(0, data.length - 3);
                }

                console.log("!!!!!!!!")
                console.log(data);
                console.log("!!!!!!!!")

                try {
                    data = JSON.parse(data);
                } catch (error) {
                    data = ensureQuotesAroundValues(data);

                    console.log("=====================================");
                    console.log(data);
                    console.log("=====================================");

                    try {
                        data = JSON.parse(data);
                    }
                    catch (e2) {
                        data = data.replace(/:\s*("?[^",\}\{]*"?)(\s*[,\}])/g, (match, p1, p2) => {
                            // Only wrap the value in quotes if it isn't already properly enclosed
                            if (!/^".*"$/.test(p1)) {
                                p1 = `"${p1}"`;
                            }
                            return `: ${p1}${p2}`;
                        });

                        try {
                            data = JSON.parse(data);
                        }
                        catch (e3) {
                            console.error("Error parsing JSON:", e3);
                            setError("An error occurred while generating the practice test.");
                        }
                    }
                }
            }
            data = replaceSymbolsInArray(data);
            setQ(data);

            const pdfBlob = await pdf(<PracticeTestPDF questions={JSON.parse(JSON.stringify(data))} />).toBlob();
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error generating practice test:", error);
            setError("An error occurred while generating the practice test.");
            setQ([]);
            setPdfUrl(null);
        }

        setLoading(false);
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div>
            <Navbar />
            <div className="practice-test-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {error ? (
                            <div className="error">{error}</div>
                        ) : q.length === 0 ? (
                            <>
                                <h1>Generate Practice Test</h1>
                                <input
                                    type="number"
                                    value={numQuestions}
                                    onChange={(e) => setNumQuestions(e.target.value)}
                                    placeholder="Number of questions"
                                    className="input"
                                    onKeyDown={(e) => {
                                        e.key === "Enter" && handleGenerate();
                                    }}
                                />
                                <button onClick={handleGenerate} className="generate-button">
                                    Generate
                                </button>
                            </>
                        ) : (
                            <>
                                {pdfUrl && (
                                    <iframe
                                        title="Practice Test"
                                        src={pdfUrl}
                                        style={{ width: '100%', height: '70vh' }}
                                    ></iframe>
                                )}
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

export default PracticeTestGenerator;