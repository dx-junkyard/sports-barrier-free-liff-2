import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { Stack, Typography } from "@mui/material"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { Box } from "@mui/system"

import PocketBase from "pocketbase"

import { useEditEvents } from "@/hooks"

import { Events } from "@/pages/events"

async function createEvent(pb: PocketBase, event: Omit<Events, "id">) {
  return await pb.collection("events").create(event)
}

async function updateEvent(
  pb: PocketBase,
  id: string,
  event: Omit<Events, "id">
) {
  return await pb.collection("events").update(id, event)
}

const ConfirmPage: NextPage<PageProps> = ({ liff, pb, pbUser }) => {
  const { editEvents } = useEditEvents()

  const router = useRouter()
  const event_id = router.query.event_id as string
  const isNew = event_id === "_new"

  // events
  const handleSubmit = useCallback(async () => {
    const event = {
      title: editEvents.title!,
      time_from: editEvents.time_from,
      time_to: editEvents.time_to,
      creator_user_id: pbUser?.id || "unknown",
      equipment_ids: editEvents.equipmentIds,
      facility_ids: editEvents.facilityIds,
    }
    if (isNew) {
      const res = await createEvent(pb!, event)
      console.log("insert new event", res)
      alert("イベントの登録に成功しました")
    } else {
      const res = await updateEvent(pb!, event_id, event)
      console.log("update event %o %o", event_id, res)
      alert("イベントの更新に成功しました")
    }
    router.push(`/events`)
  }, [])

  const handleCancel = useCallback(() => {
    history.length ? history.back() : liff?.closeWindow()
  }, [])

  // render
  return (
    <TitleContentActionLayout
      title="内容の確認"
      submitText={isNew ? "申込" : "更新"}
      canSubmit={true}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5">イベント名</Typography>
          <Typography variant="body1">{editEvents.title}</Typography>
        </Box>
        <Box>
          <Typography variant="h5">種目</Typography>
          <Typography variant="body1">
            {editEvents.equipmentIds.join(", ")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5">日時</Typography>
          <Typography variant="body1">
            {editEvents.time_from} - {editEvents.time_to}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5">場所</Typography>
          <Typography variant="body1">
            {editEvents.facilityIds.join(", ")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5">備品</Typography>
          <Typography variant="body1">ダミー</Typography>
        </Box>
      </Stack>
    </TitleContentActionLayout>
  )
}

export default ConfirmPage
