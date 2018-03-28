import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ListItemIcon, ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Visibility from 'material-ui-icons/Visibility'
import VisibilityOff from 'material-ui-icons/VisibilityOff'

import { updateCharacter, updateQc, updateBattlegroup } from '../../../ducks/actions.js'

function CardMenuHide(props) {
  if (!props.show)
    return <div />

  let action
  switch(props.characterType) {
  case 'qcs':
    action = props.updateQc
    break
  case 'battlegroups':
    action = props.updateBattlegroup
    break
  case 'characters':
  default:
    action = props.updateCharacter
  }

  return <MenuItem button>
    <ListItemText inset primary="Remove Character from Chronicle placeholder" />
  </MenuItem>
}
CardMenuHide.propTypes = {
  id: PropTypes.number.isRequired,
  characterType: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  show: PropTypes.bool,
  updateCharacter: PropTypes.func,
  updateQc: PropTypes.func,
  updateBattlegroup: PropTypes.func,
}
function mapStateToProps(state, ownProps) {
  return {
    isHidden: state.entities[ownProps.characterType][ownProps.id].hidden,
    show: state.entities[ownProps.characterType][ownProps.id].chronicle_id != undefined,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateCharacter:   (id, trait, value) => dispatch(updateCharacter(id, trait, value)),
    updateQc:          (id, trait, value) => dispatch(updateQc(id, trait, value)),
    updateBattlegroup: (id, trait, value) => dispatch(updateBattlegroup(id, trait, value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CardMenuHide)
