// const date = (index) => {
//   const dates = [
//     '2019/12/31 23:59',
//     '2 days ago',
//     '2 days ago',
//     'Today',
//   ];

//   return dates[index - 1];
// };

// const author = (index) => {
//   const authors = [
//     'Tim Macoveev',
//     'John Doe',
//     'John Doe',
//     'John Doe',
//   ];

//   return authors[index - 1];
// };

// const emotion = (index) => {
//   const emotions = [
//     'smile',
//     'sleeping',
//     'puke',
//     'angry',
//   ];

//   return emotions[index - 1];
// };

// const textComment = (index) => {
//   const textComments = [
//     'Interesting setting and a good cast',
//     'Booooooooooring',
//     'Very very old. Meh',
//     'Almost two hours? Seriously?',
//   ];

//   return textComments[index - 1];
// };

// export const generateComment = (index) => ({
//   id: index,
//   author: author(index),
//   comment: textComment(index),
//   date: date(index),
//   emotion: emotion(index),
// });

export const comments = [
  {
    'id': 1,
    'author': 'Tim Macoveev',
    'comment': 'Interesting setting and a good cast',
    'date': '2019/12/31 23:59',
    'emotion': 'smile',
  },
  {
    'id': 2,
    'author': 'John Doe',
    'comment': 'Booooooooooring',
    'date': '2 days ago',
    'emotion': 'sleeping',
  },
  {
    'id': 3,
    'author': 'John Doe',
    'comment': 'Very very old. Meh',
    'date': '2 days ago',
    'emotion': 'puke',
  },
  {
    'id': 4,
    'author': 'John Doe',
    'comment': 'Almost two hours? Seriously?',
    'date': 'Today',
    'emotion': 'angry',
  },
];
