// import React from 'react';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'column',
//         backgroundColor: '#E4E4E4',
//         padding: 20,
//     },
//     section: {
//         marginBottom: 10,
//         padding: 10,
//         flexGrow: 1,
//     },
//     dayHeader: {
//         fontSize: 18,
//         marginBottom: 6,
//         textAlign: 'center',
//         backgroundColor: '#f0f0f0',
//         padding: 10,
//         borderRadius: 5,
//     },
//     topicTitle: {
//         fontSize: 14,
//         marginBottom: 4,
//         fontWeight: 'bold',
//     },
//     topicText: {
//         fontSize: 12,
//         marginBottom: 2,
//     },
//     points: {
//         fontSize: 10,
//         marginLeft: 12,
//         marginBottom: 4,
//     }
// });

// const StudyGuidePDF = ({ content }) => {
//     // Grouping content by day
//     const groupedContent = content.reduce((acc, item) => {
//         if (!acc[item.day]) {
//             acc[item.day] = [];
//         }
//         acc[item.day].push(item);
//         return acc;
//     }, {});

//     return (
//         <Document>
//             <Page style={styles.page}>
//                 {Object.keys(groupedContent).map((day) => (
//                     <View key={day} style={styles.section}>
//                         <Text style={styles.dayHeader}>Day {day}</Text>
//                         {groupedContent[day].map((item, index) => (
//                             <View key={index} style={styles.section}>
//                                 <Text style={styles.topicTitle}>{item.title}</Text>
//                                 <Text style={styles.topicText}>{item.topics}</Text>
//                                 {item.points.split('\n').map((point, idx) => (
//                                     <Text key={idx} style={styles.points}>{point}</Text>
//                                 ))}
//                             </View>
//                         ))}
//                     </View>
//                 ))}
//             </Page>
//         </Document>
//     );
// };

// export default StudyGuidePDF;

// StudyGuidePDF.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#E4E4E4',
        padding: 20,
    },
    section: {
        marginBottom: 10,
        padding: 10,
        flexGrow: 1,
    },
    dayHeader: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 5,
    },
    topicContainer: {
        marginBottom: 12,
    },
    topicTitle: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: 'bold',
    },
    topicText: {
        fontSize: 12,
        marginBottom: 4,
    },
    points: {
        fontSize: 10,
        marginLeft: 12,
        marginBottom: 2,
    }
});

const StudyGuidePDF = ({ content }) => {
    // Grouping content by day
    const groupedContent = content.reduce((acc, item) => {
        if (!acc[item.day]) {
            acc[item.day] = [];
        }
        acc[item.day].push(item);
        return acc;
    }, {});

    return (
        <Document>
            <Page style={styles.page}>
                {Object.keys(groupedContent).map((day) => (
                    <View key={day} style={styles.section}>
                        <Text style={styles.dayHeader}>Day {day}</Text>
                        {groupedContent[day].map((item, index) => (
                            <View key={index} style={styles.topicContainer}>
                                <Text style={styles.topicTitle}>{item.title}</Text>
                                <Text style={styles.topicText}>{item.topics}</Text>
                                {item.points.split('\n').map((point, idx) => (
                                    <Text key={idx} style={styles.points}>{point}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};

export default StudyGuidePDF;