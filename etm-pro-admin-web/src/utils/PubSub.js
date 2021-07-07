class PubSub {
  constructor() {
    this.events = {}
  }
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
    this.publish(event)
  }
  publish(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => {
        cb.apply(this, args)
      })
    }
  }
  remove(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        cb => cb !== callback
      )
    }
  }
}

const single = new PubSub()

export default single
