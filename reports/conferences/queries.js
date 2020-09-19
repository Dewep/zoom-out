module.exports = {
  evolution: {
    collection: 'conference',

    datedaySeries: {
      count: { $sum: 1 }
    }
  },

  stats: {
    collection: 'conference',

    previousPeriod: {
      count: { $sum: 1 },
      nbMembersAvg: { $avg: 1 },
      durationSum: { $sum: 1 },
      durationAvg: { $avg: 1 }
    }
  }
}
