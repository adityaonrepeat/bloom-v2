// Max score = 50 (10 questions × 5 each)
export function getEmotionLevel(score: number): string {
  if (score >= 40) return "happy"
  if (score >= 30) return "calm"
  if (score >= 20) return "stressed"
  return "anxious"
}

export function getEmotionMessage(tag: string): string {
  switch (tag) {
    case "happy":
      return "You're in a wonderful headspace! Your positivity is a real strength — keep nurturing it."
    case "calm":
      return "You seem balanced and grounded. This is a great foundation for everything you do today."
    case "stressed":
      return "Things feel a bit heavy right now. Remember to breathe — you don't have to carry it all alone."
    case "anxious":
      return "You're going through a tough time. Please reach out — Aastha and our community are here for you."
    default:
      return "Thank you for checking in with yourself today."
  }
}