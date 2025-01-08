// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import { generateStudyGuide } from "../services/api";
// import StudyGuidePDF from "../components/StudyGuidePDF";
// import { pdf } from '@react-pdf/renderer';
// import "../styles/PracticeTest.css";

// const StudyGuideGenerator = () => {
//     const [numDays, setNumDays] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [content, setContent] = useState("");
//     const [pdfUrl, setPdfUrl] = useState(null);
//     const [error, setError] = useState(null);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { topic, notes, file } = location.state || {};

//     const handleGenerate = async () => {
//         if (!numDays) {
//             alert("Please enter the number of days.");
//             return;
//         }
//         if (numDays < 1 || numDays > 30) {
//             alert("Please enter a number between 1 and 30.");
//             return;
//         }

//         setLoading(true);
//         setError(null); // Reset the error state

//         try {
//             const formData = new FormData();
//             formData.append("topic", topic);
//             formData.append("numDays", numDays);
//             formData.append("file", file || "");
//             formData.append("notes", notes || "");

//             const data = await generateStudyGuide(formData);
//             setContent(data);

//             console.log(data);

//             const pdfBlob = await pdf(<StudyGuidePDF markdownContent={data} />).toBlob();
//             const url = URL.createObjectURL(pdfBlob);
//             setPdfUrl(url);
//         } catch (error) {
//             console.error("Error generating study guide:", error);
//             setError("An error occurred while generating the study guide.");
//             setContent("");
//             setPdfUrl(null);
//         }

//         setLoading(false);
//     };

//     const handleBack = () => {
//         navigate(-1); // Navigate to the previous page
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="practice-test-container">
//                 {loading ? (
//                     <div className="loading">Loading...</div>
//                 ) : (
//                     <>
//                         {error ? (
//                             <div className="error">{error}</div>
//                         ) : content === "" ? (
//                             <>
//                                 <h1>Generate Study Guide</h1>
//                                 <input
//                                     type="number"
//                                     value={numDays}
//                                     onChange={(e) => setNumDays(e.target.value)}
//                                     placeholder="Number of days to study"
//                                     className="input"
//                                     onKeyDown={(e) => {
//                                         e.key === "Enter" && handleGenerate();
//                                     }}
//                                 />
//                                 <button onClick={handleGenerate} className="generate-button">
//                                     Generate
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 {pdfUrl && (
//                                     <iframe
//                                         title="Study Guide"
//                                         src={pdfUrl}
//                                         style={{ width: '100%', height: '70vh' }}
//                                     ></iframe>
//                                 )}
//                             </>
//                         )}
//                         <button onClick={handleBack} className="back-button">
//                             Back
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default StudyGuideGenerator;
// StudyGuideGenerator.jsx
// StudyGuideGenerator.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateStudyGuide } from "../services/api";
import StudyGuidePDF from "../components/StudyGuidePDF";
import { pdf } from '@react-pdf/renderer';
import "../styles/PracticeTest.css";

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
        setError(null); // Reset the error state

        try {
            const formData = new FormData();
            formData.append("topic", topic);
            formData.append("numDays", numDays);
            formData.append("file", file || "");
            formData.append("notes", notes || "");

            let data = await generateStudyGuide(formData);
            console.log(data);
            console.log("=====================================");
            console.log(typeof data);

            if (typeof data === "string") {
                if (data.substring(0, 7) === "```json") {
                    data = data.substring(7);
                    data = data.substring(0, data.length - 3);
                }

                // Ensure all values are enclosed in double quotes
                // data = data.replace(/:\s*("?[^",\}\{]*"?)(\s*[,\}])/g, (match, p1, p2) => {
                //     // Only wrap the value in quotes if it isn't already properly enclosed
                //     if (!/^".*"$/.test(p1)) {
                //         p1 = `"${p1}"`;
                //     }
                //     return `: ${p1}${p2}`;
                // });

                console.log("!!!!!!!!")
                console.log(data);
                console.log("!!!!!!!!")

                data = JSON.parse(data);
            }
            data = replaceSymbolsInArray(data);
            setContent(data);

            const pdfBlob = await pdf(<StudyGuidePDF content={JSON.parse(JSON.stringify(data))} />).toBlob();
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error generating study guide:", error);
            setError("An error occurred while generating the study guide.");
            setContent([]);
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
                        ) : content.length === 0 ? (
                            <>
                                <h1>Generate Study Guide</h1>
                                <input
                                    type="number"
                                    value={numDays}
                                    onChange={(e) => setNumDays(e.target.value)}
                                    placeholder="Number of days to study"
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
                                        title="Study Guide"
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

export default StudyGuideGenerator;