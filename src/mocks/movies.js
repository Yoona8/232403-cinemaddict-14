import {getRandomInteger} from '../helpers/helpers';

const TITLES = [
  'The Dance of Life',
  'Harry Potter',
  'Lord of The Rings',
  'The Tourist',
  'The Uncanny Counter',
  'The Yin Yang Master',
  'Alice',
  'A Week Away',
  'Lupin',
  'Midnight Diner',
  'The Good Place',
  'Ghost in The Shell',
  'Set it Up',
  'Erased',
  'Lovely Bones',
  'Stardust',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'Tristan promises Victoria to get a star from the magical kingdom.',
  'An 1899–1900 expressionist painting by Edvard Munch, now in the National Museum of Art in Norway. The arch of life spans from white young virgin in white over the pair with red wife to an old widow in black. The painting was an important work in Munch\'s project The Frieze of Life.',
  'A series of seven fantasy novels written by British author, J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry.',
  'Eleanor, a deceased saleswoman who lived a morally corrupt life, finds herself in a heaven-like afterlife in a case of mistaken identity and tries to hide her past in order to stay there.',
  'Frank, an American tourist, is visiting Italy to deal with a recent heartbreak.',
];

const GENRES = ['Comedy', 'Romance', 'Sci-Fi', 'Fantasy', 'Drama'];

const COMMENTS_MAX_COUNT = 5;

const Rating = {
  MIN: 0,
  MAX: 10,
};

const getRandomCommentIds = (comments) => {
  const length = getRandomInteger(0, COMMENTS_MAX_COUNT);

  return new Array(length).fill('').map(() => {
    return comments[getRandomInteger(0, comments.length - 1)].id;
  });
};

const getMovie = (id, comments) => {
  const genres = GENRES.slice(0, getRandomInteger(0, GENRES.length));
  const title = TITLES[getRandomInteger(0, TITLES.length - 1)];

  return {
    id,
    title,
    director: 'Anthony Mann',
    writers: 'Anne Wigton, Heinz Herald, Richard Weil',
    actors: 'Erich von Stroheim, Mary Beth Hughes, Dan Duryea',
    originalTitle: title,
    poster: POSTERS[getRandomInteger(0, POSTERS.length - 1)],
    age: '18+',
    country: 'USA',
    rating: getRandomInteger(Rating.MIN, Rating.MAX),
    releaseDate: new Date(),
    duration: getRandomInteger(43, 240),
    genres,
    description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
    comments: new Set(getRandomCommentIds(comments)),
  };
};

const getMovies = (count, comments) => {
  return new Array(count).fill('')
    .map((item, index) => getMovie(index, comments));
};

export {getMovies};
