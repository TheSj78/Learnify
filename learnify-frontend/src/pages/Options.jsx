import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Options.css";

const Options = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topic, notes, file } = location.state || {};

    return (
        <div>
            <Navbar />
            <div className="options-container">
                <h1>{topic}</h1>
                <div className="buttons-container">
                    <button
                        className="option-button"
                        onClick={() =>
                            navigate("/flashcards", {
                                state: { topic, notes, file },
                            })
                        }
                    >
                        Generate Flashcards
                    </button>
                    <button
                        className="option-button"
                        onClick={() =>
                            navigate("/practice-test", {
                                state: { topic, notes, file },
                            })
                        }
                    >
                        Generate Practice Test
                    </button>
                    <button
                        className="option-button"
                        onClick={() =>
                            navigate("/study-guide", {
                                state: { topic, notes, file },
                            })
                        }
                    >
                        Generate Study Guide
                    </button>
                </div>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default Options;

// import React from "react";
// import { useLocation } from "react-router-dom";

// export default function Options() {
//     const location = useLocation();
//     const { topic, notes, file } = location.state || {};

//     return (
//         <div>
//             <h1>Options</h1>
//             <h1>Search Results</h1>
//             <p>
//                 <strong>Topic:</strong> {topic}
//             </p>
//             {notes && (
//                 <span>
//                     <h2>Your Notes:</h2>
//                     <p>{notes}</p>
//                 </span>
//             )}
//             {file && (
//                 <span>
//                     <h2>Attached File:</h2>
//                     <p>{file.name}</p>
//                 </span>
//             )}
//         </div>
//     );
// }
