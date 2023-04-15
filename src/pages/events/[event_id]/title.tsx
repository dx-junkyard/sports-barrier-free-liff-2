import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { TextField } from "@mui/material"

import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"

import { useEditEvents } from "@/hooks"

const DateTimePage: NextPage<PageProps> = ({ liff }) => {
  const [title, setTitle] = useState("")
  const { editEvents, setEditEvents } = useEditEvents()

  const router = useRouter()

  // on page load
  useEffect(() => {
    setTitle(editEvents.title || "")
  }, [editEvents.title])

  // events
  const handleSubmit = useCallback(() => {
    setEditEvents(() => ({ ...editEvents, title }))

    const { event_id } = router.query
    router.push(`/events/${event_id}/equipments`)
  }, [title, editEvents])

  const handleCancel = useCallback(() => {
    history.length ? history.back() : liff?.closeWindow()
  }, [])

  // render
  return (
    <TitleContentActionLayout
      title="イベント名"
      submitText="登録"
      canSubmit={!!title.length}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    >
      <TextField
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </TitleContentActionLayout>
  )
}

export default DateTimePage
