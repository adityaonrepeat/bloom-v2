export type Option = {
  label: string
  score: number
}

export type Question = {
  id: number
  text: string
  options: Option[]
}

export const questions: Question[] = [
  {
    id: 1,
    text: "How would you describe your mood right now?",
    options: [
      { label: "Very good", score: 5 },
      { label: "Good", score: 4 },
      { label: "Neutral/okay", score: 3 },
      { label: "Poor", score: 2 },
      { label: "Very poor", score: 1 }
    ]
  },
  {
    id: 2,
    text: "How anxious or nervous have you been feeling?",
    options: [
      { label: "Not at all", score: 5 },
      { label: "A little bit", score: 4 },
      { label: "Moderately", score: 3 },
      { label: "Quite a bit", score: 2 },
      { label: "Extremely", score: 1 }
    ]
  }
  // rest same
]