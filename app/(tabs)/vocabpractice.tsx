import { useAuth } from '@/app/context/AuthContext';
import { usePracticeData } from '@/app/context/PracticeDataContext';
import VocabWords from '@/data/vocab.json';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get('window');

type Option = {
    key: string;
    description: string;
    isCorrect: boolean;
};

type VocabWord = {
    word: string;
    sentence: string;
};

const VocabPractice: React.FC = () => {
    const { user } = useAuth();
    const { addVocabResult } = usePracticeData();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [practiceStats, setPracticeStats] = useState({
        questionsAnswered: 0,
        correctAnswers: 0
    });

    const getRandomWord = (): VocabWord | null => {
        if (!VocabWords || !Array.isArray(VocabWords) || VocabWords.length === 0) {
            setError("No vocabulary words available");
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * VocabWords.length);
        return VocabWords[randomIndex];
    };

    const getRandomWrongDescriptions = (correctWord: VocabWord): string[] => {
        if (!VocabWords || !Array.isArray(VocabWords) || VocabWords.length < 4) {
            setError("Not enough vocabulary words for options");
            return [];
        }
        
        let wrongDescriptions: string[] = [];
        let usedIndices = new Set([VocabWords.findIndex(word => word.word === correctWord.word)]);
        
        while (wrongDescriptions.length < 3) {
            const randomIndex = Math.floor(Math.random() * VocabWords.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                wrongDescriptions.push(VocabWords[randomIndex].sentence);
            }
        }
        
        return wrongDescriptions;
    };

    const createOptions = (word: VocabWord): Option[] => {
        if (!word) return [];
        const wrongDescriptions = getRandomWrongDescriptions(word);
        
        return [
            { key: "A", description: word.sentence, isCorrect: true },
            { key: "B", description: wrongDescriptions[0], isCorrect: false },
            { key: "C", description: wrongDescriptions[1], isCorrect: false },
            { key: "D", description: wrongDescriptions[2], isCorrect: false },
        ].sort(() => Math.random() - 0.5);
    };

    const loadWord = () => {
        setLoading(true);
        setShowAnswer(false);
        setSelectedOption(null);
        
        try {
            const word = getRandomWord();
            if (word) {
                setCurrentWord(word);
                setOptions(createOptions(word));
                setStartTime(Date.now()); // Record start time for this question
                setLoading(false);
            } else {
                setError("Failed to load a vocabulary word");
                setLoading(false);
            }
        } catch (err) {
            setError("Failed to load vocabulary data");
            setLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        loadWord();
    }, []);

    const handleOptionSelect = (key: string) => {
        setSelectedOption(key);
    };

    const handleCheckAnswer = async () => {
        if (!selectedOption || !currentWord) return;
        
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const selectedOptionObj = options.find(opt => opt.key === selectedOption);
        const correctOptionObj = options.find(opt => opt.isCorrect);
        
        if (!selectedOptionObj || !correctOptionObj) return;
        
        const isCorrect = selectedOptionObj.isCorrect;
        
        setPracticeStats(prev => ({
            questionsAnswered: prev.questionsAnswered + 1,
            correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
        }));
        
        try {
            await addVocabResult({
                word: currentWord.word,
                isCorrect,
                selectedOption: selectedOptionObj.key,
                correctOption: correctOptionObj.key,
                timeSpent
            });
        } catch (error) {
            console.error('Error in handleCheckAnswer:', error);
            Alert.alert("Error", "Could not save your result. Please try again.");
        }
        
        setShowAnswer(true);
    };

    const handleNextWord = () => {
        loadWord();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2E5BFF" />
                <Text style={styles.loadingText}>Loading vocabulary...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadWord}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    {currentWord ? (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Vocabulary Practice</Text>
                                <View style={styles.difficultyBadge}>
                                    <Text style={styles.difficultyText}>SAT</Text>
                                </View>
                            </View>

                            <View style={styles.statsContainer}>
                                <Text style={styles.statsText}>
                                    Questions: {practiceStats.questionsAnswered} | 
                                    Correct: {practiceStats.correctAnswers} | 
                                    Score: {practiceStats.questionsAnswered > 0 
                                        ? Math.round((practiceStats.correctAnswers / practiceStats.questionsAnswered) * 100) 
                                        : 0}%
                                </Text>
                            </View>

                            <View style={styles.wordContainer}>
                                <Text style={styles.wordTitle}>Word:</Text>
                                <Text style={styles.word}>{currentWord.word}</Text>
                            </View>

                            <View style={styles.questionContainer}>
                                <Text style={styles.question}>
                                    Which of the following correctly defines this word?
                                </Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option.key}
                                        style={[
                                            styles.optionButton,
                                            selectedOption === option.key && styles.selectedOption,
                                            showAnswer && option.isCorrect && styles.correctOption,
                                            showAnswer && 
                                                selectedOption === option.key && 
                                                !option.isCorrect && 
                                                styles.incorrectOption
                                        ]}
                                        onPress={() => handleOptionSelect(option.key)}
                                        disabled={showAnswer}
                                    >
                                        <Text style={styles.optionKey}>{option.key}</Text>
                                        <Text style={styles.optionText}>{option.description}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {showAnswer && (
                                <View style={styles.explanationContainer}>
                                    <Text style={styles.explanationTitle}>Definition:</Text>
                                    <Text style={styles.explanation}>
                                        {currentWord.sentence}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.buttonsContainer}>
                                {!showAnswer ? (
                                    <TouchableOpacity
                                        style={[styles.button, !selectedOption && styles.buttonDisabled]}
                                        onPress={handleCheckAnswer}
                                        disabled={!selectedOption}
                                    >
                                        <Text style={styles.buttonText}>Check Answer</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleNextWord}
                                    >
                                        <Text style={styles.buttonText}>Next Word</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.errorText}>No vocabulary word available</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    scrollView: {
        flexGrow: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    difficultyBadge: {
        backgroundColor: '#2E5BFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    difficultyText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statsContainer: {
        backgroundColor: '#E8EAF6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    statsText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    wordContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 24,
        width: '100%',
    },
    wordTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    questionContainer: {
        width: '100%',
        marginBottom: 16,
    },
    question: {
        fontSize: 16,
        color: '#333',
    },
    optionsContainer: {
        width: '100%',
        marginBottom: 24,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    selectedOption: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3',
        borderWidth: 1,
    },
    correctOption: {
        backgroundColor: '#E8F5E9',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    incorrectOption: {
        backgroundColor: '#FFEBEE',
        borderColor: '#F44336',
        borderWidth: 1,
    },
    optionKey: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E5BFF',
        marginRight: 12,
        width: 20,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    explanationContainer: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        marginBottom: 24,
    },
    explanationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    explanation: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    buttonsContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#2E5BFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#2E5BFF',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
});

export default VocabPractice;