export default function sortHistoryByDate(history) {
  if (!history) return null
  return Object.keys(history)
    .sort((a, b) => {
      return history[b].time - history[a].time
    })
    .map(item => [item, history[item].count])
}