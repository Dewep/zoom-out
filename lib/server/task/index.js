const config = require.main.require('./config')
const TaskScheduler = require('./scheduler')
const { DateTime } = require('luxon')

class Task {
  constructor () {
    this.scheduler = new TaskScheduler(this)

    this.tasksStartup = []
    this.tasks = []

    for (const key of Object.keys(config.tasks)) {
      const option = config.tasks[key]
      option.task = option.task || key

      this.registerTask('config.' + key, option)
    }
  }

  registerTask (key, option) {
    const task = {}

    if (option.enabled !== false) {
      task.key = key
      task.taskName = option.task || key
      task.triggers = option.triggers
      task.options = option.options || {}

      if (option.triggerAtServerStartup === true) {
        this.tasksStartup.push(task)
      }

      if (task.triggers && task.triggers.length) {
        this.tasks.push(task)
      }
    }
  }

  async run () {
    for (const taskStartup of this.tasksStartup) {
      await this.runTask(taskStartup.key, taskStartup.taskName, taskStartup.options, false)
    }

    for (const task of this.tasks) {
      await this.startTriggerTask(task)
    }

    this.scheduler.restartWorker()
  }

  scheduleTask (key, task, runAt, options) {
    return this.scheduler.scheduleTask(key, task, runAt, options)
  }

  async runTask (key, taskName, options, triggerNextTask = true) {
    console.info(`[task.run:${key}]`, taskName, options)

    try {
      const taskFunction = require.main.require(`./task/${taskName}.js`)

      await taskFunction(options)
    } catch (error) {
      console.error(error, {
        tags: { type: 'task' },
        extra: { key, taskName, options }
      })
    }

    if (triggerNextTask) {
      const task = this.tasks.find(t => t.key === key)

      if (!task) {
        return
      }

      await this.startTriggerTask(task)
    }
  }

  startTriggerTask (task) {
    const trigger = this.nextTrigger(task, false)

    if (trigger !== null && trigger.seconds) {
      const runAt = DateTime.local().plus({ seconds: trigger.seconds })
      return this.scheduleTask(task.key, task.taskName, runAt, task.options)
    }
  }

  nextTrigger (task) {
    if (!task.triggers || !task.triggers.length) {
      return null
    }

    const now = DateTime.local()
    let nextTrigger = null

    const checkTriggerDate = datetime => {
      const seconds = datetime.diff(now).milliseconds / 1000

      if (seconds > 0 && (!nextTrigger || nextTrigger.seconds > seconds)) {
        nextTrigger = { date: datetime, seconds }
        return nextTrigger
      }
    }

    for (const trigger of task.triggers) {
      const type = trigger.type || 'fixed'
      const hours = trigger.hours || 0
      const minutes = trigger.minutes || 0
      const seconds = trigger.seconds || 0
      const startFrom = trigger.startFrom || 0

      if (type === 'fixed') {
        checkTriggerDate(now.set({ hours, minutes }).startOf('minute'))
        checkTriggerDate(now.set({ hours, minutes }).plus({ days: 1 }).startOf('minute'))
      } else if (type === 'interval') {
        if (trigger.hours <= 0 && trigger.minutes <= 0 && trigger.seconds <= 0) {
          continue
        }

        let date = now.set({ hours: startFrom, minutes: 0 }).startOf('minute')
        const tomorrow = date.plus({ days: 1 })
        while (!checkTriggerDate(date) && date < tomorrow) {
          date = date.plus({ hours, minutes, seconds })
        }
      }
    }

    return nextTrigger
  }
}

module.exports = new Task()
