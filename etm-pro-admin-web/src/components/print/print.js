export function print({ resolved }) {
  console.log(resolved)
  const { path, params } = resolved
  const url = `${path}?type=${params.type}&props=${JSON.stringify(params.props) || JSON.stringify({})}`
  window.open(url, '_blank')
}
