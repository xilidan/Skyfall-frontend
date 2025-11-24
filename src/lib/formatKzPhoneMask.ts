export const formatKzPhoneMask = (raw: string) => {
  const digits = raw.replace(/\D/g, '')
  // Accept either 10 local digits or 11 with leading 7/8
  let local = digits
  if (local.startsWith('8')) local = '7' + local.slice(1)
  if (local.startsWith('7')) local = local.slice(1)
  local = local.slice(0, 10)

  const p1 = local.slice(0, 3)
  const p2 = local.slice(3, 6)
  const p3 = local.slice(6, 8)
  const p4 = local.slice(8, 10)

  let out = '+7'
  if (p1) out += ` (${p1}`
  if (p1 && p1.length === 3) out += ')'
  if (p2) out += ` ${p2}`
  if (p3) out += `-${p3}`
  if (p4) out += `-${p4}`
  return out
}
