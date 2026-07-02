import { getPasswordStrength } from '../../src/utils/password'

describe('getPasswordStrength', () => {
  describe('score calculation', () => {
    it.each([
      // [password, minLength, maxLength, expected.score, description]
      ['', null, 64, 0, 'empty password'],
      ['1234567', 8, 64, 0, 'too short (7 chars < 8 min)'],
      ['12345678', 8, 64, 1, 'min length met but sequential pattern'],
      ['aaaaaaaa', 8, 64, 1, 'min length met but repeated characters'],
      ['bbbbbbbb', 8, 64, 1, 'min length met but repeated characters'],
      ['abcccdef', 8, 64, 1, 'min length met but repeated characters'],
      ['aaabcdef', 8, 64, 1, 'min length met but repeated characters'],
      ['abcdefff', 8, 64, 1, 'min length met but repeated characters'],
      ['abcde!!!', 8, 64, 1, 'min length met but repeated characters'],
      ['aaAaaAaa', 8, 64, 1, 'min length met but case-insensitive repetition'],
      ['chat🐈🐈🐈🐈', 8, 64, 1, 'min length met but repeated characters'],

      ['aabbccdd', 8, 64, 1, 'repeated pairs'],
      ['ababab12', 8, 64, 1, 'repeated pattern (ab ab ab)'],

      ['!!!!!!!!', 8, 64, 1, 'repeated special characters'],
      ['1111chat', 8, 64, 1, 'repeated digits at the start'],
      ['ch1111at', 8, 64, 1, 'repeated digits in the middle'],
      ['chat1111', 8, 64, 1, 'repeated digits at the end'],

      ['appeller', 8, 64, 1, 'min length met with limited repetition'],

      ['chat1234', 8, 64, 1, 'min length met but sequential pattern'],
      ['chat3210', 8, 64, 1, 'min length met but sequential pattern'],

      ['chatABCD', 8, 64, 1, 'min length met but sequential pattern'],
      ['chatNMLK', 8, 64, 1, 'min length met but sequential pattern'],

      ['ab12cd34', 8, 64, 1, 'alternating pattern without true sequence'],

      ['abcdefgh', 8, 64, 1, 'simple alphabetical sequence'],
      ['hgfedcba', 8, 64, 1, 'reverse alphabetical sequence'],
      ['ABC12345', 8, 64, 1, 'numeric sequence after letters'],

      ['chatAZER', 8, 64, 1, 'min length met but keyboard sequence'],
      ['chatQSDF', 8, 64, 1, 'min length met but keyboard sequence'],
      ['chatWXCV', 8, 64, 1, 'min length met but keyboard sequence'],
      ['chatQWER', 8, 64, 1, 'min length met but keyboard sequence'],

      ['chaqwert', 8, 64, 1, 'QWERTY keyboard sequence'],
      ['asdfghjk', 8, 64, 1, 'keyboard sequence (home row)'],
      ['zxcvbnm?', 8, 64, 1, 'keyboard sequence (bottom row)'],

      ['qasqas12', 8, 64, 1, 'keyboard pattern with digits'],

      ['abcdefgh', 8, 64, 1, '8 lowercase letters: ~37 bits'],
      ['ABCDEFGH', 8, 64, 1, '8 uppercase letters: ~37 bits'],
      ['abcdef12', 8, 64, 1, '6 letters + 2 digits: ~37 bits'],

      ['password', 8, 64, 1, 'common 8-char word: ~37 bits'],
      ['aabbccdd', 8, 64, 1, 'repeated pairs: ~30 bits'],
      ['Pass1235', 8, 64, 1, 'mixed upper/lower + digits: ~48 bits'],
      ['Abc12645', 8, 64, 1, '1 uppercase + 3 lowercase + 4 digits: ~43 bits'],
      ['myPass99', 8, 64, 1, 'letters + digits mix: ~45 bits'],
      ['ab12cd34', 8, 64, 1, 'alternating letters and digits: ~47 bits'],
      ['Xy9Zk4Lm', 8, 64, 1, 'mixed case with spaced digits: ~50 bits'],

      ['Password@1254', 8, 64, 2, 'letters + digits + symbol: ~62 bits'],
      ['MyP@ss99!QS', 8, 64, 2, '4 character classes: ~65 bits'],
      ['Kp9#mQ2xL9A', 8, 64, 2, 'mixed case + digits + symbols: ~68 bits'],
      ['Tr0ub4dor&2', 11, 64, 2, '11 varied chars: ~75 bits'],
      ['Ej4*pL9#vC4', 8, 64, 2, '10 chars, 4 classes: ~72 bits'],

      ['P@ssw0rd#Secure12', 8, 64, 3, '16 varied chars: ~85 bits'],
      ['MySecureP@ss!2024', 8, 64, 3, '17 chars: ~92 bits'],
      ['Kx9@mQ#pL$vC2*Rt', 8, 64, 3, '16-char mixed set: ~88 bits'],
      ['Tr0ub4d0r&C@tfish9', 8, 64, 3, '19 chars: ~95 bits'],

      ['P@ssw0rd#Secure12!AZ', 8, 64, 4, '20 varied chars: ~104 bits'],
      ['MySecureP@ss!2024#Xkv', 8, 64, 4, '22 chars: ~114 bits'],
      ['Kx9@mQ#pL$vC2*Rt!WyZ', 8, 64, 4, '20 chars mixed set: ~108 bits'],
      ['Tr0ub4d0r&C@tfish99#XyZ', 8, 64, 4, '24 chars: ~128 bits'],

      ['le chat mange la souris', 8, 64, 4, 'passphrase example'],

      ['email@exemple.com', 8, 64, 2, 'email adress'],

      [
        'bbNBFt2okt4H03fdrFqlwigHxakPPdCZMEbt65MesByuBC1mxaoHRiYwab4FKjLq',
        8,
        64,
        4,
        '64 chars accepted',
      ],
      [
        'bbNBFt2okt4H03fdrFqlwigHxakPPdCZMEbt65MesByuBC1mxaoHRiYwab4FKjLq5',
        8,
        64,
        0,
        '65 chars rejected',
      ],
    ])(
      'password: "%s" → score %i (%s)',
      (password, minLength, maxLength, expectedScore) => {
        const result = getPasswordStrength(password, minLength, maxLength)
        expect(result.score).toBe(expectedScore)
      }
    )
  })
})
