const questions = [
    {
      id: 1,
      question: 'Qual è la capitale d\'Italia?',
      answers: [
        {
            answer: 'Torino',
            rightAnswer: false,
        },
        {
            answer: 'Roma',
            rightAnswer: true,
        },
        {
            answer: 'Milano',
            rightAnswer: false,
        },
        {
            answer: 'Napoli',
            rightAnswer: false,
        },
      ]
    },
    {
        id: 2,
        question: 'Qual è la capitale della Francia?',
        answers: [
          {
              answer: 'Lille',
              rightAnswer: false,
          },
          {
              answer: 'Parigi',
              rightAnswer: true,
          },
          {
              answer: 'Bordeaux',
              rightAnswer: false,
          },
          {
              answer: 'Marsiglia',
              rightAnswer: false,
          },
        ]
      }
]

export { questions };
