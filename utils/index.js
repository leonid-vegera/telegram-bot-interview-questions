const questions = require('../data/questions.json');

function getRandomIndex(maxNum) {
  return Math.floor(Math.random() * maxNum);
}
function getQuestion(sectionTitle) {
  let topic = sectionTitle.toLowerCase();
  if (topic === 'випадкове питання') {
    let sections = Object.keys(questions);
    topic = sections[getRandomIndex(sections.length - 1)];
  }
  const quizGroup = questions[topic]
  const randomIndex = getRandomIndex(quizGroup.length);
  return {
    question: quizGroup[randomIndex],
    questionTopic: topic,
  }
}

function getCorrectAnswer(id, type) {
  const normalizedType = type.toLowerCase();
  const question = questions[normalizedType].find(question => question.id === id);

  if(!question.hasOptions) {
    return question.answer;
  }
  return question.options.find(option => option.isCorrect).text;
}

module.exports = { getQuestion, getCorrectAnswer };
