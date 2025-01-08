import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    question: {
        marginBottom: 10,
    },
    answer: {
        marginBottom: 5,
    },
    error: {
        color: 'red',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50,
    },
});

const PracticeTestPDF = ({ questions }) => {
    console.log(questions);
    console.log("sodfjslkdfjdslkjfs");
    
    const isValidQuestions = Array.isArray(questions) && questions.every(question =>
        question.id && question.question && question.a && question.b && question.c && question.d && question.correct
    );

    return (
        <Document>
            {isValidQuestions ? (
                <>
                    <Page size="A4" style={styles.page}>
                        <Text style={{ fontSize: 20, marginBottom: 20 }}>Practice Test</Text>
                        {questions.map((question) => (
                            <View key={question.id} style={styles.section}>
                                <Text style={styles.question}>{question.id}. {question.question}</Text>
                                <Text style={styles.answer}>a) {question.a}</Text>
                                <Text style={styles.answer}>b) {question.b}</Text>
                                <Text style={styles.answer}>c) {question.c}</Text>
                                <Text style={styles.answer}>d) {question.d}</Text>
                            </View>
                        ))}
                    </Page>
                    <Page size="A4" style={styles.page}>
                        <Text style={{ fontSize: 20, marginBottom: 20 }}>Answers</Text>
                        {questions.map((question) => (
                            <View key={question.id} style={styles.section}>
                                <Text style={styles.question}>{question.id}. {question.correct}</Text>
                            </View>
                        ))}
                    </Page>
                </>
            ) : (
                <Page size="A4" style={styles.page}>
                    <Text style={styles.error}>Error: Please try again. If this error persists, try changing your topic.</Text>
                </Page>
            )}
        </Document>
    );
};

export default PracticeTestPDF;