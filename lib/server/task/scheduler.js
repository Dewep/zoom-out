const mongo = require('../mongo')
const { DateTime } = require('luxon')

class TaskScheduler {
  constructor (task) {
    this.collectionName = 'task'

    this.task = task
    this.defaultWait = 10 * 60 * 1000
    this.forceStopWorkerTimer = null
  }

  removeTask (key) {
    return mongo.deleteOne(this.collectionName, { key })
  }

  async scheduleTask (key, taskName, runAt, options = {}) {
    console.info(`[task.schedule] ${key} at ${runAt.toISO()}`)
    const runAtMilliseconds = runAt.toMillis() - DateTime.local().toMillis()

    await mongo.insertOrUpdate(this.collectionName, { key }, { $set: { taskName, options, runAt: runAt.toJSDate() } })

    if (this.forceStopWorkerTimer && runAtMilliseconds < this.defaultWait) {
      this.forceStopWorkerTimer()
    }
  }

  async restartWorker () {
    let wait = this.defaultWait

    try {
      const nextTask = await mongo.findOne(this.collectionName, {}, { sort: { runAt: 1 } })

      if (nextTask) {
        const now = DateTime.local()
        const runAt = DateTime.fromJSDate(nextTask.runAt)

        if (now >= runAt) {
          const result = await this.removeTask(nextTask.key)

          if (result.deletedCount) {
            await this.task.runTask(nextTask.key, nextTask.taskName, nextTask.options)
          }

          wait = 1000
        } else {
          wait = Math.min(wait, runAt.valueOf() - now.valueOf())
        }
      }
    } catch (error) {
      console.error(error)

      wait = 1000
    }

    await new Promise(resolve => {
      const timerID = setTimeout(resolve, wait)
      this.forceStopWorkerTimer = () => {
        clearTimeout(timerID)
        resolve()
      }
    })

    this.forceStopWorkerTimer = null

    this.restartWorker()
  }
}

module.exports = TaskScheduler
