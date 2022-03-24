export function useConvertors () {
  const snakeToCamel = (str: string) => str.replace(
    /([-_][a-z])/g,
    (group: string) => group.toUpperCase()
      .replace('-', '')
      .replace('_', '')
  )
  return { snakeToCamel }
}
