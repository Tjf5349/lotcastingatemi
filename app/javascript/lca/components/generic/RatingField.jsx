// @flow
import React, { Component } from 'react'

import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'

import { clamp } from 'utils/'

const styles = theme => ({
  field: {
    marginRight: theme.spacing.unit,
    width: '4em',
  },
  narrow: {
    marginRight: theme.spacing.unit,
    width: '3em',
  },
})

type Props = {
  trait: string,
  label: string,
  value: number,
  onChange: Function,
  min: number,
  max: number,
  margin?: 'none' | 'dense' | 'normal',
  narrow?: boolean,
  dontFocus?: boolean,
  classes: Object,
}
type State = { value: number, oldValue: number }
// TODO: Special fields for x/y resources like mote/willpower pools
class RatingField extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { value: this.props.value, oldValue: this.props.value }
  }

  static defaultProps = { min: 0, max: Infinity }
  static getDerivedStateFromProps = (props, state) => {
    if (state.oldValue === props.value) return null

    return { value: props.value, oldValue: props.value }
  }

  handleChange = (e: SyntheticInputEvent<>) => {
    const { min, max } = this.props

    if (isNaN(parseInt(e.target.value))) {
      // $FlowThisIsOkayISwear
      this.setState({ value: e.target.value })
      return
    }

    let value = clamp(parseInt(e.target.value), min, max)
    const fakeE = { target: { name: e.target.name, value: value } }

    if (isNaN(parseInt(this.state.value)))
      this.setState({ oldValue: this.state.value })

    this.props.onChange(fakeE)
  }

  handleFocus = (e: SyntheticInputEvent<>) => {
    if (this.props.dontFocus) return

    e.target.select()
  }

  handleBlur = (e: SyntheticInputEvent<>) => {
    if (isNaN(parseInt(this.state.value))) {
      this.setState({ value: Math.max(0, this.props.min) })
      this.props.onChange({
        target: { name: e.target.name, value: Math.max(0, this.props.min) },
      })
    }
  }

  render() {
    const { trait, label, classes, narrow, min, max } = this.props
    const { handleChange, handleFocus, handleBlur } = this
    const { value } = this.state

    return (
      <TextField
        className={narrow ? classes.narrow : classes.field}
        type="number"
        name={trait}
        label={label}
        value={value}
        inputProps={{ min: min, max: max }}
        onChange={handleChange}
        margin={this.props.margin || 'none'}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )
  }
}

export default withStyles(styles)(RatingField)
