export function checkUploadRecoursePath(val) {
  const reg = /(\S+\/)(\S+\/)/
  // const reg = /(\S+\/)(\S+\/)(\S+\/)(image|video)$/
  return reg.test(val)
}
