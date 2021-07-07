class RunFuncAsync {
  constructor(fn) {
    this.fn = fn
  }
  run() {
    setTimeout(() => {
      if (this.fn) {
        this.fn()
        this.fn = null
      }
    }, 0)
  }
  static getInstance(fn) {
    if (this.instance) {
      this.instance.fn = fn
      return this.instance
    }
    this.instance = new RunFuncAsync(fn)
    return this.instance
  }
}

export default RunFuncAsync
