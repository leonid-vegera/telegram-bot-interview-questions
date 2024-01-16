const questions = require('../data/questions.json');

function getRandomIndex(maxNum) {
  return Math.floor(Math.random() * maxNum);
}
function getQuestion(sectionTitle) {
  const topic = sectionTitle.toLowerCase();
  const quizGroup = questions[topic]
  const randomIndex = getRandomIndex(quizGroup.length)
  return quizGroup[randomIndex];
}

module.exports = { getQuestion };
