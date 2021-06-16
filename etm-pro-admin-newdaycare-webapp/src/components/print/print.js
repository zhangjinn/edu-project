export function print ({ resolved }) {
  console.log(resolved)
  const { path, query } = resolved
  const url = `${path}?type=${query.type}&props=${JSON.stringify(query.props) || JSON.stringify({})}`
  window.open(url, '_blank')
}
