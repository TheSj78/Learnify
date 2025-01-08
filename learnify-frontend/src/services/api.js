// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/gemini";

export const generateFlashcards = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/flashcards`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        return JSON.parse(`[{"id": 1, "question": "Error generating flashcards", "answer": "${error.message}"}]`);
    }
};

export const generatePracticeTest = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/practice-test`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        return JSON.parse(`[{"id": 1, "question": "Error generating practice test", "a": "${error.message}", "b": "", "c": "", "d": "", "correct": ""}]`);
    }
};

export const generateStudyGuide = async (formData) => {
    console.log('going to backend');
    const response = await axios.post(`${API_URL}/study-guide`, formData, {
       headers: {
           "Content-Type": "multipart/form-data",
       },
    });
    return response.data;
};
