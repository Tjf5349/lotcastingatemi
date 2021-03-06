// @flow
import * as React from 'react'
const { Component, Fragment } = React
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import Checkbox from 'material-ui/Checkbox'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import { FormControlLabel } from 'material-ui/Form'
import Typography from 'material-ui/Typography'

import RatingField from 'components/generic/RatingField.jsx'
import { recoverWillpower } from 'ducks/events'

type Props = { id: number, recoverWillpower: Function }
type State = {
  open: boolean,
  toRecover: number,
  exceed: boolean,
  qcs: boolean,
}
class MoteRespirePopup extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      toRecover: 0,
      exceed: false,
      qcs: false,
    }
  }

  handleOpen = () => this.setState({ open: true })
  handleClose = () =>
    this.setState({ open: false, toRecover: 0, exceed: false, qcs: false })

  handleAdd = wp =>
    this.setState({ toRecover: Math.max(this.state.toRecover + wp, 0) })

  handleReset = () => this.setState({ toRecover: 0 })

  handleChange = e => {
    let { name, value } = e.target

    if (name === 'toRecover') {
      let val = Math.max(parseInt(value), 0)
      this.setState({ toRecover: val })
    } else {
      this.setState({ [name]: value })
    }
  }

  handleCheck = e =>
    this.setState({ [e.target.name]: !this.state[e.target.name] })

  handleSubmit = () => {
    const { toRecover, exceed, qcs } = this.state
    this.props.recoverWillpower(this.props.id, toRecover, exceed, qcs)
    this.handleClose()
  }

  render() {
    const { toRecover, exceed, qcs, open } = this.state
    const {
      handleOpen,
      handleClose,
      handleAdd,
      handleReset,
      handleChange,
      handleCheck,
      handleSubmit,
    } = this

    return (
      <Fragment>
        <Button onClick={handleOpen}>Recover Willpower</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Recover Willpower</DialogTitle>

          <DialogContent>
            <DialogContentText>
              A good night&apos;s sleep restores one point. Willpower is fully
              restored at the end of each story. Achieving a major character or
              story goal restores 1-3 points, which can exceed the
              character&apos;s permanent rating.
            </DialogContentText>
            <Typography variant="caption">(Core p.169-170)</Typography>

            <div>
              <Button size="small" onClick={() => handleAdd(-1)}>
                -1
              </Button>
              &nbsp;&nbsp;
              <RatingField
                trait="toRecover"
                value={toRecover}
                label="Willpower"
                margin="dense"
                min={0}
                max={10}
                onChange={handleChange}
              />
              <Button size="small" onClick={handleReset}>
                0
              </Button>
              <Button size="small" onClick={() => handleAdd(1)}>
                +1
              </Button>
              <Button size="small" onClick={() => handleAdd(5)}>
                +5
              </Button>
            </div>
            <FormControlLabel
              label="Exceed permanent ratings (max 10)"
              control={
                <Checkbox
                  name="exceed"
                  checked={exceed}
                  onChange={handleCheck}
                />
              }
            />
            <br />

            <FormControlLabel
              label="Include QCs"
              control={
                <Checkbox name="qcs" checked={qcs} onChange={handleCheck} />
              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="raised" color="primary" onClick={handleSubmit}>
              Recover
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

export default connect(null, { recoverWillpower })(MoteRespirePopup)
