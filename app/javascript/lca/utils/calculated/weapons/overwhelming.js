// @flow
import type { Character, fullWeapon } from 'utils/flow-types'

export function weaponOverwhelming(character: Character, weapon: fullWeapon) {
  if (weapon.tags.includes('subtle')) return 0
  if (weapon.tags.includes('elemental bolt')) return 1 + character.essence

  let bonus = 0
  if (weapon.tags.includes('balanced')) bonus += 1

  const overwhelmingTag = weapon.tags.find(t => t.startsWith('overwhelming+'))
  if (overwhelmingTag) {
    let theBonus = overwhelmingTag.substr(13)
    bonus += theBonus.includes('essence')
      ? character.essence
      : parseInt(theBonus)
  }

  if (!weapon.is_artifact) return Math.max(1 + bonus, 0)
  switch (weapon.weight) {
    case 'light':
      return Math.max(3 + bonus, 0)
    case 'medium':
      return Math.max(4 + bonus, 0)
    case 'heavy':
      return Math.max(5 + bonus, 0)
  }
}
