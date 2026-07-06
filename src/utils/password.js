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
  const lower = value.toLowerCase()
  for (let i = 0; i < lower.length - 3; i++) {
    const slice = lower.slice(i, i + 4)
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
