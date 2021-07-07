const solutionFiles = require.context('./solution', true, /\.js$/)

const solution = solutionFiles.keys().reduce((file, solutionValue) => {
  const value = solutionFiles(solutionValue)
  for (const i in value.default) {
    file[i] = value.default[i]
  }
  return file
}, {})

export default solution
