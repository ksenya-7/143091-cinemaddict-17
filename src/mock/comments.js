import {getRandomInteger} from '../utils.js';

const generateDate = () => {
  const dates = [
    '1933-05-10T16:12:12.554Z',
    '1935-04-11T16:13:22.554Z',
    '1937-06-12T16:14:32.554Z',
    '2019-07-13T16:12:42.554Z',
    '1960-08-14T16:15:52.554Z',
    '2020-09-15T16:16:35.554Z',
    '2015-10-16T16:17:36.554Z',
    '1955-12-17T16:18:37.554Z',
  ];

  const randomIndex = getRandomInteger(0, dates.length - 1);

  return dates[randomIndex];
};

const generateAuthor = () => {
  const authors = [
    'Ilya O\u0027Reilly',
    'Tim Macoveev',
    'John Doe',
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);

  return authors[randomIndex];
};

const generateEmotion = () => {
  const emotions = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];

  const randomIndex = getRandomInteger(0, emotions.length - 1);

  return emotions[randomIndex];
};

const generateTextComment = () => {
  const textComments = [
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];

  const randomIndex = getRandomInteger(0, textComments.length - 1);

  return textComments[randomIndex];
};

export const generateComment = (index) => ({
  'id': index,
  'author': generateAuthor(),
  'comment': generateTextComment(),
  'date': generateDate(),
  'emotion': generateEmotion(),
});
