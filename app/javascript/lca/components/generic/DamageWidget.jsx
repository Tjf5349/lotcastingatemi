import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import ButtonBase from 'material-ui/ButtonBase'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'

import HealthLevelBoxes from './HealthLevelBoxes.jsx'
import RatingField from './RatingField.jsx'
import { takeDamage } from '../../ducks/actions.js'
import { canIEditCharacter, canIEditQc } from '../../selectors'
import { clamp } from '../../utils'

class DamageWidget extends Component {
  constructor(props) {
    super(props)
    this.state = { open: false, bashing: 0, lethal: 0, aggravated: 0 }

    this.min = this.min.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  min(type) {
    return -this.props.character[`damage_${type}`]
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleAdd(dmg, type) {
    this.setState({ [type]: clamp(this.state[type] + dmg, this.min(type), Infinity) })
  }

  handleChange(e) {
    const { name, value } = e.target
    let commit = this.state.commit
    if (name === 'toSpend')
      commit = (this.state.toSpend + value) >= 0
    this.setState({ [name]: value, commit: commit })
  }

  handleCheck(e) {
    this.setState({ [e.target.name]: !this.state[e.target.name] })
  }

  handleSubmit() {
    const { bashing, lethal, aggravated } = this.state
    const { character, qc } = this.props

    const characterType = qc ? 'qc' : 'character'

    if (bashing !== 0)
      this.props.takeDamage(character.id, bashing, 'bashing', characterType)
    if (lethal !== 0)
      this.props.takeDamage(character.id, lethal, 'lethal', characterType)
    if (aggravated !== 0)
      this.props.takeDamage(character.id, aggravated, 'aggravated', characterType)

    this.setState({ open: false, bashing: 0, lethal: 0, aggravated: 0 })
  }

  render() {
    const { bashing, lethal, aggravated, open, } = this.state
    const {
      handleOpen, handleClose, handleAdd, handleChange, handleSubmit, min
    } = this
    const { canEdit, children, character } = this.props

    if (!canEdit) {
      return children
    }

    return <Fragment>
      <ButtonBase onClick={ handleOpen } style={{ fontSize: '1em' }}>
        { children }
      </ButtonBase>
      <Dialog
        open={ open }
        onClose={ handleClose }
      >
        <DialogTitle>
          Health Levels / Damage
        </DialogTitle>

        <DialogContent>
          <div style={{ textAlign: 'center' }}>
            <HealthLevelBoxes character={{
              ...character, ...{
                damage_bashing: character.damage_bashing + bashing,
                damage_lethal: character.damage_lethal + lethal,
                damage_aggravated: character.damage_aggravated + aggravated,
              }}}
            />
          </div>

          <div>
            <Button size="small" onClick={ () => handleAdd(-1, 'bashing') }>-1</Button>
            &nbsp;&nbsp;
            <RatingField trait="bashing" value={ bashing }
              label="Bashing" narrow margin="dense"
              min={ min('bashing') }
              onChange={ handleChange }
            />

            <Button size="small" onClick={ () => handleChange({ target: { name: 'bashing', value: min('bashing') }})}>
              =0
            </Button>
            <Button size="small" onClick={ () => handleAdd(1, 'bashing') }>+1</Button>
          </div>

          <div>
            <Button size="small" onClick={ () => handleAdd(-1, 'lethal') }>-1</Button>
            &nbsp;&nbsp;
            <RatingField trait="lethal" value={ lethal }
              label="Lethal" narrow margin="dense"
              min={ min('lethal') }
              onChange={ handleChange }
            />

            <Button size="small" onClick={ () => handleChange({ target: { name: 'lethal', value: min('lethal') }})}>
              =0
            </Button>
            <Button size="small" onClick={ () => handleAdd(1, 'lethal') }>+1</Button>
          </div>

          <div>
            <Button size="small" onClick={ () => handleAdd(-1, 'aggravated') }>-1</Button>
            &nbsp;&nbsp;
            <RatingField trait="aggravated" value={ aggravated }
              label="Aggravated" narrow margin="dense"
              min={ min('aggravated') }
              onChange={ handleChange }
            />

            <Button size="small" onClick={ () => handleChange({ target: { name: 'aggravated', value: min('aggravated') }})}>
              =0
            </Button>
            <Button size="small" onClick={ () => handleAdd(1, 'aggravated') }>+1</Button>
          </div>

        </DialogContent>

        <DialogActions>
          <Button onClick={ handleClose }>
            Cancel
          </Button>
          <Button variant="raised" color="primary" onClick={ handleSubmit }>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  }
}
DamageWidget.propTypes = {
  children: PropTypes.node.isRequired,
  character: PropTypes.object.isRequired,
  qc: PropTypes.bool,
  canEdit: PropTypes.bool,
  takeDamage: PropTypes.func,
}
function mapStateToProps(state, props) {
  return {
    canEdit: props.qc ? canIEditQc(state, props.character.id) : canIEditCharacter(state, props.character.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    takeDamage: (id, damage, damageType, characterType) => dispatch(takeDamage(id, damage, damageType, characterType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DamageWidget)