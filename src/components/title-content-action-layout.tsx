import React from "react"
import { Stack, Button, Typography } from "@mui/material"

interface Props {
  title: string
  submitText: string
  canSubmit: boolean
  cancelText?: string
  canCancel?: boolean
  onSubmit?: () => void
  onCancel?: () => void

  children: React.ReactNode
}

export const TitleContentActionLayout: React.FC<Props> = (props) => {
  const { title, canSubmit, submitText } = props
  const cancelText = props.cancelText || "キャンセル"
  const canCancel = props.canCancel || true

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{title}</Typography>
      {props.children}
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Button variant="outlined" disabled={!canCancel} onClick={props.onCancel}>
          {cancelText}
        </Button>
        <Button variant="contained" sx={{ px: 4 }} disabled={!canSubmit} onClick={props.onSubmit}>
          {submitText}
        </Button>
      </Stack>
    </Stack>
  )
}
