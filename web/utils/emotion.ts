export function getEmotionLevel(score: number): string {

  if (score >= 40) return "happy"
  if (score >= 30) return "calm"
  if (score >= 20) return "stressed"
  return "anxious"
  
}