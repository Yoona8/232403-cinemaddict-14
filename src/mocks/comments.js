import {getRandomInteger} from '../helpers/helpers';
import {EMOJIS} from '../helpers/consts';

const COMMENTS = [
  'Best movie ever!',
  'I love both books in the series. The first one is more about the palace and all the intrigues and disgusting price a person sometimes has to pay to follow the destiny.',
  'Yet another enjoyable romance! As expected it was as good as all Penny\'s other romances. I love her characters for not being perfect. I don\'t like reading about perfect people, imperfection is the best!',
  'The book was just average. I expected more interesting story. All the characters are very simple and either good or bad. When reading a story like this there should be something. Either interesting characters or the story or at least the cozy feeling. But this one lacks of everything.',
  'Oh so dark and atmospheric! I love those dark tales and they are perfect for a cold winter evening when it\'s snowing outside (you know those extremely quite evenings in the countryside, classical white christmas-ish atmosphere).',
];

const getComment = (id) => {
  const emojis = EMOJIS;

  return {
    id,
    author: 'John Snow',
    movieId: null,
    message: COMMENTS[getRandomInteger(0, COMMENTS.length - 1)],
    emoji: emojis[getRandomInteger(0, emojis.length - 1)],
    date: new Date(),
  };
};

const getComments = (count) => {
  return new Array(count).fill('').map((item, index) => getComment(`${index}`));
};

export {getComments};
