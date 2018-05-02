// @flow
import React from 'react'

import Checkbox from 'material-ui/Checkbox'
import { FormControlLabel } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'

import BlockPaper from 'components/generic/blockPaper.jsx'
import WeightSelect from 'components/generic/weightSelect.jsx'

import type { withArmorStats as Character } from 'utils/flow-types'

type Props = {
  character: Character,
  onChange: Function,
  onBlur: Function,
  onRatingChange: Function,
  onCheck: Function,
}
function ArmorEditor(props: Props) {
  const { character, onChange, onBlur, onRatingChange, onCheck } = props

  // TODO: show interesting calculated values here
  return (
    <BlockPaper>
      <Typography variant="title">Armor</Typography>

      <TextField
        label="Name"
        margin="dense"
        name="armor_name"
        value={character.armor_name}
        onChange={onChange}
        onBlur={onBlur}
        fullWidth
      />
      <br />

      <WeightSelect
        armor
        name="armor_weight"
        value={character.armor_weight}
        onChange={onRatingChange}
        margin="dense"
      />
      <br />

      <FormControlLabel
        label="Artifact"
        control={
          <Checkbox
            name="armor_is_artifact"
            checked={character.armor_is_artifact}
            onChange={onCheck}
          />
        }
      />
      <br />

      <TextField
        name="armor_tags"
        value={character.armor_tags.join(',')}
        label="Tags (comma separated)"
        margin="dense"
        fullWidth
        onChange={onChange}
        onBlur={onBlur}
      />
    </BlockPaper>
  )
}

export default ArmorEditor