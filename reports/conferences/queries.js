module.exports = {
  history: {
    collection: 'conference',

    datedaySeries: {
      count: { $sum: 1 }
    }
  },

  stats: {
    collection: 'conference',

    datedayPreviousPeriod: {
      project: {
        nbMembers: 1,
        duration: 1
      },
      group: {
        count: { $sum: 1 },
        nbMembersAvg: { $avg: '$nbMembers' },
        durationSum: { $sum: '$duration' },
        durationAvg: { $avg: '$duration' }
      }
    }
  }
}
