const questions = [
    {
      id: 0,
      question: 'Qual è la capitale d\'Italia?',
      answers: [
        {
            index: 0,
            answer: 'Torino',
            rightAnswer: false,
            isclicked: false,
        },
        {
            index: 1,
            answer: 'Roma',
            rightAnswer: true,
            isclicked: false,
        },
        {
            index: 2,
            answer: 'Milano',
            rightAnswer: false,
            isclicked: false,
        },
        {
            index: 3,
            answer: 'Napoli',
            rightAnswer: false,
            isclicked: false,
        },
      ]
    },
    {
        id: 1,
        question: 'Qual è la capitale della Francia?',
        answers: [
          {
            index: 0,
            answer: 'Lille',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 1,
            answer: 'Parigi',
            rightAnswer: true,
            isclicked: false,
          },
          {
            index: 2,
            answer: 'Bordeaux',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 3,
            answer: 'Marsiglia',
            rightAnswer: false,
            isclicked: false, 
          },
        ]
      },
      {
        id: 2,
        question: 'Qual è la capitale della Germania?',
        answers: [
          {
            index: 0,
            answer: 'Monaco',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 1,
            answer: 'Berlino',
            rightAnswer: true,
            isclicked: false,
          },
          {
            index: 2,
            answer: 'Stoccarda',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 3,
            answer: 'Amburgo',
            rightAnswer: false,
            isclicked: false,
          },
        ]
      },
      {
        id: 3,
        question: 'Qual è la capitale della Spagna?',
        answers: [
          {
            index: 0,
            answer: 'Barcellona',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 1,
            answer: 'Madrid',
            rightAnswer: true,
            isclicked: false,
          },
          {
            index: 2,
            answer: 'Valencia',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 3,
            answer: 'Malaga',
            rightAnswer: false,
            isclicked: false,
          },
        ]
      },
      {
        id: 4,
        question: 'Qual è la capitale dell\' Inghilterra?',
        answers: [
          {
            index: 0,
            answer: 'Leeds',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 1,
            answer: 'Londra',
            rightAnswer: true,
            isclicked: false,
          },
          {
            index: 2,
            answer: 'Manchester',
            rightAnswer: false,
            isclicked: false,
          },
          {
            index: 3,
            answer: 'Liverpool',
            rightAnswer: false,
            isclicked: false,
          },
        ]
      }
];

const moneyJackpot = [
  {
    id: 0,
    value: 500
  },
  {
    id: 1,
    value: 1000
  },
  {
    id: 2,
    value: 2500
  },
  {
    id: 3,
    value: 6000
  },
  {
    id: 4,
    value: 10000
  },

]

export { questions, moneyJackpot };
