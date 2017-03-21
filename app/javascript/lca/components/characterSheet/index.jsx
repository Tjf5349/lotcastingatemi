import React from 'react'
import { connect } from 'react-redux'
import { fetchCharacter, toggleEditor, updateCharacter } from '../../actions'

import CharacterSheetDisplay from './characterSheetDisplay.jsx'

class CharacterSheet extends React.Component {
  constructor(props) {
    super(props)

    this.editorToggle = this.editorToggle.bind(this)
  }

  componentDidMount() {
    this.props.onComponentMounted(this.props.id)
  }

  editorToggle(e) {
    e.preventDefault()
    this.props.onEditorToggleClick()
  }

  render() {
    const { character, weapons, merits } = this.props

    // Don't render the display without a character
    if (character == undefined)
      return(<h1>Lot-Casting Atemi</h1>)

    return (<CharacterSheetDisplay
      character={ character }
      weapons={ weapons } merits={ merits }
      toggleClick={this.editorToggle}
    />);
  }
}

function mapStateToProps(state, ownProps) {
  const character = state.character.characters[ownProps.id]
  let weapons = []
  let merits = []

  if (character != undefined) {
    weapons = character.weapons.map((id) => state.character.weapons[id])
    merits = character.merits.map((id) => state.character.merits[id])
  }

  const { isFetching, isError } = state.app
  return {
    character,
    weapons,
    merits,
    isFetching,
    isError
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onComponentMounted: (id) => {
      dispatch(fetchCharacter(id))
    },
    updateChar: (id, trait, value) => {
      dispatch(updateCharacter(id, trait, value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterSheet)
