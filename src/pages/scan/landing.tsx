import { useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import "dayjs/locale/ja"

import { Divider, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"

import { Record as PbRecord } from "pocketbase"

import { PageProps } from "@/pages/_app"
import { Events } from "@/pages/events"

export type PbEvents = Events & PbRecord

function formatDateTime(time_from: string, time_to: string): string {
  const from = dayjs(time_from)
  const to = dayjs(time_to)

  return `${from.format("YYYY年M月D日")} ${from.format("HH:mm")} - ${to.format(
    "HH:mm"
  )}`
}

const ScanLanding: NextPage<PageProps> = ({ pb, pbUser }) => {
  const [events, setEvents] = useState<Record<string, Events>>({})
  const router = useRouter()

  function onScanClick(event: Events) {
    router.push({
      pathname: "/scan/qr",
      query: {
        event_id: event.id,
      },
    })
  }

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb || !pbUser) return

      // fetch equipments
      const list = await pb
        .collection("events")
        .getFullList({ $autoCancel: false, sort: "+time_from" })

      // apply to state
      const events = Object.fromEntries(
        list
          .filter((item) => item.creator_user_id === pbUser?.id)
          .map((item) => [
            item.id,
            {
              id: item.id,
              title: item.title,
              time_from: item.time_from,
              time_to: item.time_to,
              creator_user_id: item.creator_user_id,
              equipment_ids: item.equipment_ids,
              facility_ids: item.facility_ids,
            },
          ])
      )
      setEvents(events)
    })()
  }, [pb])

  return (
    <Stack spacing={3}>
      <Typography variant="h5">予約中のイベント一覧</Typography>

      {Object.values(events).map((item) => (
        <Stack key={item.id} spacing={1}>
          <Box
            sx={{ backgroundColor: "#eee", borderRadius: 1, p: 2 }}
            onClick={() => onScanClick(item)}
          >
            <Typography variant="body1">
              {formatDateTime(item.time_from, item.time_to)}
            </Typography>
            <Typography variant="body1">{item.title}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
        </Stack>
      ))}
    </Stack>
  )
}

export default ScanLanding
