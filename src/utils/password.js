const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  'zyxwvutsrqponmlkjihgfedcba',
  '01234567890',
  '09876543210',
  'azertyuiop',
  'poiuytreza',
  'qsdfghjklm',
  'mlkjhgfdsq',
  'wxcvbn',
  'nbvcxw',
  'qwertyuiop',
  'poiuytrewq',
  'asdfghjkl',
  'lkjhgfdsa',
  'zxcvbnm',
  'mnbvcxz',
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

const ENTROPY_THRESHOLDS = {
  weak: 30,
  fair: 45,
  good: 60,
  strong: 80,
}

function calculateTotalEntropy(value) {
  const chars = [...value]
  const length = chars.length
  if (length === 0) {
    return 0
  }

  let poolSize = 0
  let hasLower = false
  let hasUpper = false
  let hasDigits = false
  let hasSymbols = false
  let hasUnicode = false

  for (const char of chars) {
    if (/[a-z]/.test(char)) {
      hasLower = true
    } else if (/[A-Z]/.test(char)) {
      hasUpper = true
    } else if (/[0-9]/.test(char)) {
      hasDigits = true
    } else if (/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/.test(char)) {
      hasSymbols = true
    } else {
      hasUnicode = true
    }
  }

  if (hasLower) {
    poolSize += 26
  }
  if (hasUpper) {
    poolSize += 26
  }
  if (hasDigits) {
    poolSize += 10
  }
  if (hasSymbols) {
    poolSize += 33
  }
  if (hasUnicode) {
    poolSize += 26
  }

  return Math.log2(poolSize) * length
}

function hasRepeatedCharacters(value) {
  return /(.+)\1{2,}/iu.test(value)
}

function hasSequentialPattern(value) {
  const chars = [...value.toLowerCase()]
  for (let i = 0; i < chars.length - 3; i++) {
    const slice = chars.slice(i, i + 4).join('')
    if (SEQUENCES.some((seq) => seq.includes(slice))) {
      return true
    }
  }
  return false
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

function lengthToScore(length, minLength) {
  if (length < minLength) {
    return 0
  }
  if (length < minLength + 2) {
    return 1
  }
  if (length < minLength + 4) {
    return 2
  }
  if (length < minLength + 6) {
    return 3
  }
  return 4
}

export const getPasswordStrength = (value, minLength, maxLength) => {
  if (!value) {
    return { score: 0 }
  }

  const length = [...value].length
  if (length < minLength || length > maxLength) {
    return { score: 0 }
  }

  if (
    hasRepeatedCharacters(value) ||
    hasSequentialPattern(value) ||
    isEmailAddress(value)
  ) {
    return { score: 1 }
  }

  const entropy = calculateTotalEntropy(value)
  const entropyScore = entropyToScore(entropy)
  const lengthScore = lengthToScore(length, minLength)

  return { score: Math.min(entropyScore, lengthScore) }
}
