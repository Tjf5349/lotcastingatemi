import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

import { prettyFullExaltType } from '../../utils/calculated'
import { fullChar } from '../../utils/propTypes'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  })
})

function CharacterListItem(props) {
  const { character, classes } = props

  return <div>
    <Paper className={ classes.root }>

      <Typography variant="title">
        { character.name }
      </Typography>

      <Typography paragraph>
        Essence { character.essence } { prettyFullExaltType(character) }
      </Typography>

      <Button component={ Link } to={ `/characters/${character.id}` }>
        Full Sheet
      </Button>

      <Button component={ Link } to={ `/characters/${ character.id }/edit` }>
        Edit
      </Button>
    </Paper>
  </div>
}
CharacterListItem.propTypes = {
  character: PropTypes.shape(fullChar).isRequired,
  classes: PropTypes.object,
}

export default withStyles(styles)(CharacterListItem)