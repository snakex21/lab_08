import React, { useState } from "react";
import questions from "../questions.json";
import Question from "./question";
import Answers from "./answers";
import Results from "./results";
import Actions from "./actions";
 const styles = {
  display: "flex",
  justifyContent: "center",
};
 const totalQuestions = questions.length;
 const QuizComponent = (props) => {
  const [visitedIndexes, setVisitedIndexes] = useState([]);
  const [markedIndexes, setMarkedIndexes] = useState([]);
  const [currentIndex, setIndex] = useState(0);
  const [currentQuestion, setQuestion] = useState(questions[currentIndex]);
  const [currentPoints, setPoints] = useState(0);
  const [allowToChoose, changePermission] = useState(true);
  const [markedAnswer, markAnswer] = useState({ key: -1, variant: "" });
   const handleNextQuestion = () => {
    const nextValue = currentIndex + 1;
    if (nextValue > questions.length - 1) {
      setIndex(questions.length - 1);
      return;
    }
    setIndex(nextValue);
    setQuestion(questions[nextValue]);
    changePermission(true);
    retrieveMarkedAnswer(nextValue);
    setVisitedIndexes([...visitedIndexes, currentIndex]);
  };
   const handlePrevQuestion = () => {
    const prevValue = currentIndex - 1;
    if (prevValue < 0) {
      setIndex(0);
      return;
    }
    setIndex(prevValue);
    setQuestion(questions[prevValue]);
    changePermission(true);
    retrieveMarkedAnswer(prevValue);
    if (visitedIndexes.includes(currentIndex)) {
      setVisitedIndexes(visitedIndexes.filter((index) => index !== currentIndex));
    }
  };
   const retrieveMarkedAnswer = (newIndex) => {
    if (visitedIndexes.includes(newIndex)) {
      const currentAnswer = questions[newIndex].user_answer;
      const answerKey = questions[newIndex].answers.findIndex(
        (answer) => answer === currentAnswer
      );
      const isCorrect = questions[newIndex].correct_answer === currentAnswer;
      markAnswer({ key: answerKey, variant: isCorrect ? "bg-success" : "bg-danger" });
    } else {
      markAnswer({ key: -1, variant: "" });
    }
  };
   const handleCheckAnswer = (chosenOption, key) => {
    if (!allowToChoose) {
      return;
    }
    if (currentQuestion.correct_answer === chosenOption) {
      let points = currentPoints;
      if (!visitedIndexes.includes(currentIndex)) {
        points = points + 1;
        setPoints(points);
        setVisitedIndexes([...visitedIndexes, currentIndex]);
      }
      changePermission(false);
      markAnswer({ key, variant: "bg-success" });
      questions[currentIndex].correct = true; 
    } else {
      changePermission(false);
      markAnswer({ key, variant: "bg-danger" });
      const unansweredIndexes = [...Array(totalQuestions).keys()].filter(
        (index) => !visitedIndexes.includes(index)
      );
      if (unansweredIndexes.length === 0) {
        changePermission(false);
      }
    }
    questions[currentIndex].user_answer = chosenOption;
  };
   const handleMarkQuestion = (index) => {
    if (markedIndexes.includes(index)) {
      setMarkedIndexes(markedIndexes.filter((i) => i !== index));
    } else {
      setMarkedIndexes([...markedIndexes, index]);
    }
  };
   const isAnsweredAndCorrect = (i) => {
    return (
      visitedIndexes.includes(i) &&
      questions[i].correct_answer === questions[visitedIndexes.indexOf(i)].user_answer
    );
  };
   const isAnsweredAndMarked = (i) => {
    return (
      markedIndexes.includes(i) &&
      (!visitedIndexes.includes(i) ||
        questions[i].correct_answer !== questions[i].user_answer)
    );
  };
   const getQuestionVariant = (index) => {
    if (isAnsweredAndMarked(index)) { 
      return "bg-info";
    }
    if (isAnsweredAndCorrect(index)) {
      return "bg-success";
    }
    if (visitedIndexes.includes(index)) {
      return "bg-danger";
    }
    return "";
  };
   return (
    <div style={styles}>
      <div className="containter">
        <p>Quiz</p>
        <Question
          className="col-12"
          currentQuestion={currentQuestion.question}
          currentIndex={currentIndex + 1}
          allQuestions={questions.length}
        />
        <Answers
          className="col-12"
          checkAnswer={handleCheckAnswer}
          currentAnswers={currentQuestion.answers}
          markedAnswer={markedAnswer}
        />
        <Results points={currentPoints} />
        <Actions
          disablePrev={currentIndex > 0}
          disableNext={currentIndex !== questions.length - 1}
          prev={handlePrevQuestion}
          next={handleNextQuestion}
          markedIndexes={markedIndexes}
          markQuestion={handleMarkQuestion}
          visitedIndexes={visitedIndexes}
          getQuestionVariant={getQuestionVariant}
        />
      </div>
    </div>
  );
};
 export default QuizComponent;