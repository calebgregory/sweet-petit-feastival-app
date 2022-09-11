export function classnames(
  ...ns: (string | boolean | null | undefined)[]
): string {
  return ns.filter(Boolean).join(" ")
}
