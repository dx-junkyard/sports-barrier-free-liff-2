import { useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { Divider, Grid, Link, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"

import dayjs from "dayjs"
import "dayjs/locale/ja"

import { Record as PbRecord } from "pocketbase"

import { PageProps } from "@/pages/_app"

export interface Events {
  id: string
  title: string
  time_from: string
  time_to: string
  creator_user_id?: string
  equipment_ids?: string[]
  facility_ids?: string[]
}

export type PbEvents = Events & PbRecord

function formatDateTime(time_from: string, time_to: string): string {
  const from = dayjs(time_from)
  const to = dayjs(time_to)

  return `${from.format("YYYY年M月D日")} ${from.format("HH:mm")} - ${to.format(
    "HH:mm"
  )}`
}

const EventsIndexPage: NextPage<PageProps> = ({ pb, pbUser }) => {
  const [events, setEvents] = useState<Record<string, Events>>({})
  const router = useRouter()

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb) return

      // fetch equipments
      const list = await pb
        .collection("events")
        .getFullList({
          $autoCancel: false,
          sort: "+time_from" /*filter: `time_to >= "${new Date().toISOString().replace('T', ' ')}"` */,
        })

      // apply to state
      const events = Object.fromEntries(
        list.map((item) => [
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
      <Typography variant="h5">
        <Link onClick={() => router.push("/events/_new/")}>イベントを作る</Link>
      </Typography>

      <Typography variant="h5">イベントを探す</Typography>

      {Object.values(events).map((item) => (
        <Stack spacing={1}>
          <Box
            sx={{
              width: "320px",
              height: "120px",
              border: "1px solid #bbb",
              borderRadius: "24px",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" color={"white"}>
              THUMBNAIL
            </Typography>
          </Box>
          <Typography variant="body1">
            {formatDateTime(item.time_from, item.time_to)}
          </Typography>
          <Typography variant="body1">{item.title}</Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="body2">
                主催者: {item.creator_user_id}
              </Typography>
            </Grid>
            {item.creator_user_id === pbUser?.id && (
              <Grid item>
                <Typography variant="body2">
                  <Link onClick={() => router.push(`/events/${item.id}`)}>
                    編集する
                  </Link>
                </Typography>
              </Grid>
            )}
          </Grid>
          <Divider sx={{ mb: 2 }} />
        </Stack>
      ))}
    </Stack>
  )
}

export default EventsIndexPage
