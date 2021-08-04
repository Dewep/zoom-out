const { DateTime } = require('luxon')

class TaskScheduler {
  constructor (task) {
    this.task = task
    this.defaultWait = 10 * 60 * 1000
    this.forceStopWorkerTimer = null
  }

  async scheduleTask (key, taskName, runAt, options = {}) {
    if (!key) {
      key = JSON.stringify({ taskName, options })
    }

    console.info(`[task.schedule] ${key} at ${runAt.toLocaleString(DateTime.DATETIME_FULL)}`)
    const runAtMilliseconds = runAt.toMillis() - DateTime.local().toMillis()

    setTimeout(() => {
      this.task.runTask(key, taskName, options)
    }, runAtMilliseconds)

    if (this.forceStopWorkerTimer && runAtMilliseconds < this.defaultWait) {
      this.forceStopWorkerTimer()
    }
  }
}

module.exports = TaskScheduler
