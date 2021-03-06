// @flow
import React from 'react'

import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  label: {
    ...theme.typography.body1,
    fontSize: '0.75rem',
    fontWeight: 500,
    opacity: 0.7,
  },
  value: {
    position: 'relative',
  },
  current: {
    ...theme.typography.display1,
    display: 'inline-block',
    verticalAlign: 'top',
  },
  total: {
    ...theme.typography.body1,
    display: 'inline-block',
    verticalAlign: 'top',
    marginTop: '0.25em',
  },
  committed: {
    ...theme.typography.caption,
    display: 'inline-block',
    position: 'absolute',
    bottom: '0.25em',
    right: '0.2em',
  },
})

type Props = {
  current: number,
  total: number,
  committed?: number,
  label: string,
  className?: string,
  classes: Object,
}
const ResourceDisplay = ({
  current,
  total,
  committed,
  label,
  className,
  classes,
}: Props) => (
  <div className={className}>
    <div className={classes.label}>{label}</div>
    <div className={classes.value}>
      <span className={classes.current}>{current}</span>
      <span className={classes.total}>/{total}</span>
      {(committed || 0) > 0 && (
        <span className={classes.committed}>{committed}c</span>
      )}
    </div>
  </div>
)

export default withStyles(styles)(ResourceDisplay)
