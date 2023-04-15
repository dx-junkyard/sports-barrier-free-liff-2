import type { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Record as PbRecord } from "pocketbase"

import { PageProps } from "@/pages/_app"
import {
  Facilities,
  FacilitiesCheckboxes,
} from "@/pages/events/[event_id]/facilities"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"

type FacilityRecord = Facilities & PbRecord

const QRPage: NextPage<PageProps> = ({ pb }) => {
  const [eventId, setEventId] = useState<string>("")
  const [ownerIds, setOwnerIds] = useState<string[]>([])
  const [facilities, setFacilities] = useState<
    Record<string, FacilitiesCheckboxes>
  >({})
  const [selectedValues, setSelectedValues] = useState<FacilitiesCheckboxes[]>(
    []
  )

  const router = useRouter()

  // facilities
  const handleChange = useCallback(
    (id: string) => {
      const facility = facilities[id]
      if (!facility) throw Error("facilities id not found")

      facility._checked = !facility._checked

      setFacilities({ ...facilities, [id]: facility })
    },
    [facilities]
  )

  const handleSubmit = useCallback(() => {
    const facilityIds = selectedValues.map((x) => x.id)
    router.push({
      pathname: "/scan/equipment",
      query: {
        event_id: eventId,
        owner_ids: JSON.stringify(ownerIds),
        facility_ids: JSON.stringify(facilityIds),
      },
    })
  }, [selectedValues, facilities])

  // computed value
  useEffect(() => {
    setSelectedValues(Object.values(facilities).filter((item) => item._checked))
  }, [facilities])

  // parse query
  useEffect(() => {
    console.log(router.query)
    setOwnerIds(JSON.parse((router.query.owner_ids as string) || "[]"))
    setEventId((router.query.event_id as string) || "")
  }, [pb])

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb || !eventId || !ownerIds.length) return

      const list = await pb.collection("event_to_facilities").getFullList({
        $autoCancel: false,
        filter: `id="${eventId}" && facility_owner_id="${ownerIds[0]}"`,  // WHERE
        expand: "facility",  // expand relation
      })

      const facilities = Object.fromEntries(
        list
          .map((item) => item.expand.facility as FacilityRecord)
          .map((item) => [
            item.id,
            {
              ...item,
              _checked: false,
              _disabled: false,
            } as FacilitiesCheckboxes,
          ])
      )

      setFacilities(facilities)
    })()
  }, [pb, ownerIds, eventId])

  // render
  return (
    <TitleContentActionLayout
      title="借りる設備"
      submitText="登録"
      canSubmit={true}
      onSubmit={handleSubmit}
    >
      <FormGroup>
        {Object.values(facilities).map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                checked={item._checked}
                disabled={item._disabled}
                onChange={() => handleChange(item.id)}
              />
            }
            label={`${item.name}`}
          />
        ))}
      </FormGroup>
      {/* <pre>{JSON.stringify(facilities, null, 2)}</pre> */}
    </TitleContentActionLayout>
  )
}

export default QRPage
