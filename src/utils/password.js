const SEQUENTIAL_PATTERNS = [
  /(0123|1234|2345|3456|4567|5678|6789|7890)/,
  /(0987|9876|8765|7654|6543|5432|4321|3210)/,
  /(abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz)/i,
  /(zyxw|yxwv|xwvu|wvut|vuts|utsr|tsrq|srqp|rqpo|qpon|ponm|onml|nmlk|mlkj|lkji|kjih|jihg|ihgf|hgfe|gfed|fedc|edcb|dcba)/i,
  /(azer|zert|erty|qsdf|sdfg|wxcv|xcvb)/i,
  /(qwer|wert|erty|asdf|sdfg|zxcv|xcvb)/i,
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

const ENTROPY_THRESHOLDS = {
  weak: 30,
  fair: 45,
  good: 60,
  strong: 80,
}

function splitPassword(str) {
  const parts = []

  const letters = str.match(/[a-zA-Z]+/g)
  if (letters) {
    parts.push({ type: 'letters', value: letters })
  }

  const digits = str.match(/[0-9]+/g)
  if (digits) {
    parts.push({ type: 'digits', value: digits })
  }

  const symbols = str.match(/[^a-zA-Z0-9]+/g)
  if (symbols) {
    parts.push({ type: 'symbols', value: symbols })
  }

  return parts
}

function entropyOfSegment(seg) {
  switch (seg.type) {
    case 'digits':
      return Math.log2(10) * seg.value.join('').length

    case 'symbols':
      return Math.log2(30) * seg.value.join('').length

    case 'letters':
      return Math.log2(26) * seg.value.join('').length
  }
}

function calculateTotalEntropy(value) {
  const segments = splitPassword(value)
  return segments.reduce((total, seg) => total + entropyOfSegment(seg), 0)
}

function isOutsideLengthRange(value, minLength, maxLength) {
  return [...value].length < minLength || [...value].length > maxLength
}

function hasRepeatedCharacters(value) {
  return /(.)\1{2,}/iu.test(value)
}

function hasSequentialPattern(value) {
  return SEQUENTIAL_PATTERNS.some((pattern) => pattern.test(value))
}

function isEmailAddress(value) {
  return EMAIL_REGEX.test(value)
}

function entropyToScore(entropy) {
  if (entropy < ENTROPY_THRESHOLDS.weak) {
    return 0
  }
  if (entropy < ENTROPY_THRESHOLDS.fair) {
    return 1
  }
  if (entropy < ENTROPY_THRESHOLDS.good) {
    return 2
  }
  if (entropy < ENTROPY_THRESHOLDS.strong) {
    return 3
  }
  return 4
}

export const getPasswordStrength = (value, minLength, maxLength) => {
  if (!value) {
    return { score: 0 }
  }

  if (isOutsideLengthRange(value, minLength, maxLength)) {
    return { score: 0 }
  }

  if (hasRepeatedCharacters(value)) {
    return { score: 1 }
  }

  if (hasSequentialPattern(value)) {
    return { score: 1 }
  }

  if (isEmailAddress(value)) {
    return { score: 2 }
  }

  const entropy = calculateTotalEntropy(value)
  const entropyScore = entropyToScore(entropy)
  return { score: entropyScore }
}
