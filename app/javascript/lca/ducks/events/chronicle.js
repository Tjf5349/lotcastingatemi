// @flow
import { isEqual } from 'lodash'
import { updateEventMulti } from '.'
import { healthRecoverObject } from './healing.js'
import {
  getCharactersForChronicle,
  getMeritNamesForCharacter,
  getQcsForChronicle,
} from 'selectors'
import {
  committedPersonalMotes,
  committedPeripheralMotes,
} from 'utils/calculated'
import type { DowntimeOptions } from 'utils/flow-types'

const endSceneObject = c => {
  let obj = {}
  const commits = c.motes_committed.filter(m => !m.scenelong)

  if (!isEqual(commits, c.motes_committed)) obj.motes_committed = commits
  if (c.aura != null && c.aura != '') obj.aura = ''

  return obj
}

export const END_SCENE = 'lca/event/CHRONICLE_END_SCENE'
export function endScene(id: number) {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: END_SCENE, id: id })

    const state = getState()
    let chars = [
      ...getCharactersForChronicle(state, id),
      ...getQcsForChronicle(state, id),
    ]
    chars.forEach(c => {
      const update = updateEventMulti(c.type)
      const obj = endSceneObject(c)

      if (Object.keys(obj).length > 0) dispatch(update(c.id, obj))
    })
  }
}
const moteRecoveryObject = (character, motes) => {
  let obj = {}
  if (motes === 0) return obj

  const availablePeripheral =
    character.motes_peripheral_total - committedPeripheralMotes(character)
  const spentPeripheral =
    availablePeripheral - character.motes_peripheral_current
  const availablePersonal =
    character.motes_personal_total - committedPersonalMotes(character)
  const spentPersonal = availablePersonal - character.motes_personal_current

  if (spentPersonal === 0 && spentPeripheral === 0) return obj

  if (spentPeripheral > 0)
    obj.motes_peripheral_current = Math.min(
      character.motes_peripheral_current + motes,
      availablePeripheral
    )
  if (spentPersonal > 0 && motes - spentPeripheral > 0)
    obj.motes_personal_current = Math.min(
      character.motes_personal_current + (motes - spentPeripheral),
      availablePersonal
    )
  return obj
}
export const RESPIRE_MOTES = 'lca/event/CHRONICLE_RESPIRE_MOTES'
export function respireMotes(id: number, motes: number, includeQcs: boolean) {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: RESPIRE_MOTES, id: id, motes: motes })

    const state = getState()
    let chars = [...getCharactersForChronicle(state, id)]
    if (includeQcs) chars = [...chars, ...getQcsForChronicle(state, id)]
    chars.forEach(c => {
      const update = updateEventMulti(c.type)
      const obj = moteRecoveryObject(c, motes)
      if (Object.keys(obj).length > 0) dispatch(update(c.id, obj))
    })
  }
}

const willpowerRecoveryObject = (character, willpower, exceed = false) => {
  if (willpower === 0) return {}

  const max = exceed ? 10 : character.willpower_permanent
  const val = Math.min(character.willpower_temporary + willpower, max)
  if (character.willpower_temporary === val) return {}

  return { willpower_temporary: val }
}
export const RECOVER_WILLPOWER = 'lca/event/CHRONICLE_RECOVER_WP'
export function recoverWillpower(
  id: number,
  willpower: number,
  exceed: boolean,
  includeQcs: boolean
) {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: RECOVER_WILLPOWER, id: id, willpower: willpower })

    const state = getState()
    let chars = [...getCharactersForChronicle(state, id)]
    if (includeQcs) chars = [...chars, ...getQcsForChronicle(state, id)]
    chars.forEach(c => {
      const update = updateEventMulti(c.type)
      const obj = willpowerRecoveryObject(c, willpower, exceed)
      if (Object.keys(obj).length > 0) dispatch(update(c.id, obj))
    })
  }
}

export const DOWNTIME = 'lca/event/CHRONICLE_DOWNTIME'
export function downtime(id: number, time: number, endScene: boolean) {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: DOWNTIME, id: id, length: time })
    const state = getState()
    let chars = [
      ...getCharactersForChronicle(state, id),
      ...getQcsForChronicle(state, id),
    ]
    chars.forEach(c => {
      const update = updateEventMulti(c.type)
      let obj: { [string]: number } = {}
      let merits = []
      let exaltedHealing = true
      let moteBonus = 0

      if (endScene) obj = { ...obj, ...endSceneObject({ ...c, ...obj }) }
      /* ANIMA */
      if (c.anima_level > 0) obj.anima_level = 0

      /* HEALTH */
      if (c.type === 'qc') {
        // QCs with personal motes are considered spirits or Exalts
        exaltedHealing = c.motes_personal_total > 0
      } else {
        merits = getMeritNamesForCharacter(state, c.id)
        // Mortals PCs can use the Exalted Healing merit to heal like Exalts
        exaltedHealing =
          c.type !== 'Character' ||
          merits.some(m => m.startsWith('exalted healing'))
      }

      obj = {
        ...obj,
        ...healthRecoverObject({ ...c, ...obj }, time, exaltedHealing),
      }

      /* MOTES/WILLPOWER */
      // 4-dot Hearthstones increase out-of-combat mote regen by 4
      if (
        merits.includes('hearthstone6') ||
        merits.includes('hearthstone5') ||
        merits.includes('hearthstone4')
      )
        moteBonus = 4
      // 2-dot Hearthstones increase out-of-combat mote regen by 2
      else if (merits.some(m => m.startsWith('hearthstone'))) moteBonus = 2
      const motesPerDay = 8 * (10 + moteBonus) + 16 * (5 + moteBonus)
      const motesPerHour =
        time >= 8 ? Math.ceil(motesPerDay / 24) : 5 + moteBonus

      obj = {
        ...obj,
        ...moteRecoveryObject({ ...c, ...obj }, motesPerHour * time),
      }

      let willpower = 0
      if (time >= 8) willpower = Math.ceil(time / 24)

      obj = { ...obj, ...willpowerRecoveryObject({ ...c, ...obj }, willpower) }

      if (Object.keys(obj).length > 0) dispatch(update(c.id, obj))
    })
  }
}
