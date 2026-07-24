const SEQUENTIAL_WINDOW_SIZE = 4
const SEQUENCE_SOURCES = [
  '01234567890',
  'abcdefghijklmnopqrstuvwxyz',
  'azertyuiop',
  'qsdfghjklm',
  'wxcvbn',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
]

function generateSequentialTokens(sequence) {
  const patterns = []

  for (let i = 0; i <= sequence.length - SEQUENTIAL_WINDOW_SIZE; i += 1) {
    patterns.push(sequence.slice(i, i + SEQUENTIAL_WINDOW_SIZE))
  }

  return patterns
}

const SEQUENTIAL_TOKENS = new Set(
  SEQUENCE_SOURCES.flatMap((source) => [
    ...generateSequentialTokens(source),
    ...generateSequentialTokens([...source].reverse().join('')),
  ])
)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

const ENTROPY_THRESHOLDS = {
  weak: 30,
  fair: 48,
  good: 75,
  strong: 100,
}

const LENGTH_THRESHOLDS = {
  weak: 8,
  fair: 12,
  good: 16,
  strong: 20,
}

function calculateTotalEntropy(value) {
  const length = [...value].length
  if (length === 0) {
    return 0
  }

  let poolSize = 0
  const hasLower = /[a-z]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasDigits = /[0-9]/.test(value)
  const hasSymbols = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/.test(value)
  const hasUnicode = /[^a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/.test(
    value
  )

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
    poolSize += 32
  }
  if (hasUnicode) {
    poolSize += 32
  }

  return Math.log2(poolSize) * length
}

function isOutsideLengthRange(value, minLength, maxLength) {
  return [...value].length < minLength || [...value].length > maxLength
}

function hasRepeatedCharacters(value) {
  return /(.)\1{2,}/iu.test(value)
}

function hasSequentialPattern(value) {
  const normalized = value.toLowerCase()
  for (let i = 0; i <= normalized.length - SEQUENTIAL_WINDOW_SIZE; i += 1) {
    const slice = normalized.slice(i, i + SEQUENTIAL_WINDOW_SIZE)
    if (SEQUENTIAL_TOKENS.has(slice)) {
      return true
    }
  }
  return false
}

function isEmailAddress(value) {
  return EMAIL_REGEX.test(value)
}

function entropyToScore(entropy) {
  return Object.values(ENTROPY_THRESHOLDS).filter(
    (threshold) => entropy >= threshold
  ).length
}

function lengthToScore(length) {
  return Object.values(LENGTH_THRESHOLDS).filter(
    (threshold) => length >= threshold
  ).length
}

export const getPasswordStrength = (value, minLength, maxLength) => {
  if (!value) {
    return { score: 0 }
  }

  if (isOutsideLengthRange(value, minLength, maxLength)) {
    return { score: 0 }
  }

  const entropy = calculateTotalEntropy(value)
  const lengthScore = lengthToScore([...value].length)
  const entropyScore = entropyToScore(entropy)

  let score = Math.min(lengthScore, entropyScore)

  if (hasRepeatedCharacters(value) || hasSequentialPattern(value)) {
    score = Math.max(1, score - 1)
  }

  if (isEmailAddress(value)) {
    score = Math.min(score, 2)
  }

  return { score }
}
