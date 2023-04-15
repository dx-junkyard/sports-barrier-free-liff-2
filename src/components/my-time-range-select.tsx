import React from "react"
import { Select, MenuItem, SelectChangeEvent } from "@mui/material"

interface Props {
  value?: string
  onChange?: (newValue: string) => void
}

export const MyTimeRangeSelect: React.FC<Props> = ({ value, onChange }) => {
  const selection = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ]

  const handleChange = (event: SelectChangeEvent) => {
    onChange?.(event.target.value)
  }

  return (
    <Select value={value} onChange={handleChange}>
      {selection.map((item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  )
}
