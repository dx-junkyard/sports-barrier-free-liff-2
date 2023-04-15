import { useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { useEditEvents } from "@/hooks"
import { PageProps } from "@/pages/_app"
import { PbEvents } from "@/pages/events"

const EventsIndexPage: NextPage<PageProps> = ({ pb, pbUser }) => {
  const { setEditEvents, reset } = useEditEvents()
  const router = useRouter()

  let event_id = router.query.event_id as string

  useEffect(() => {
    if (!pb) return
    ;(async () => {
      if (event_id === "_new") {
        // start with new page
        reset()
      } else {
        // try to load from db and edit
        try {
          const event = await pb
            .collection("events")
            .getOne<PbEvents>(event_id, { $autoCancel: false })

          setEditEvents(() => ({
            title: event.title,
            creatorId: event.creator_user_id || pbUser?.id || "unknown",
            facilityIds: event.facility_ids || [],
            equipmentIds: event.equipment_ids || [],
            time_from: event.time_from,
            time_to: event.time_to,
          }))
        } catch (error) {
          console.error(error)
          event_id = "_new"
          reset()
        }
      }

      // redirect to edit page
      router.replace(`/events/${event_id}/title`)
    })()
  }, [pb])

  return <></>
}

export default EventsIndexPage
