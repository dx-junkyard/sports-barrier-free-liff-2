import type { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Record as PbRecord } from "pocketbase"

import { PageProps } from "@/pages/_app"
import {
  Equipments,
  EquipmentCheckboxes,
} from "@/pages/events/[event_id]/equipments"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material"

type EquipmentsRecord = Equipments & PbRecord

const EquipmentPage: NextPage<PageProps> = ({ pb, pbUser }) => {
  const [ownerIds, setOwnerIds] = useState<string[]>([])
  const [eventId, setEventId] = useState<string>("")
  const [facilityIds, setFacilityIds] = useState<string[]>([])
  const [equipments, setEquipments] = useState<
    Record<string, EquipmentCheckboxes>
  >({})
  const [selectedValues, setSelectedValues] = useState<EquipmentCheckboxes[]>(
    []
  )

  const router = useRouter()

  // toggle check
  const handleChange = useCallback(
    (id: string) => {
      const equipment = equipments[id]
      if (!equipment) throw Error("equipment id not found")

      equipment._checked = !equipment._checked

      setEquipments({ ...equipments, [id]: equipment })
    },
    [equipments]
  )

  // handle submit button
  const handleSubmit = useCallback(async () => {
    if (!pb) return

    for (const equipment of selectedValues) {
      const payload = {
        status: 2,
        equipment_user_id: pbUser?.id || "unknown",
      }

      const res = await pb
        .collection("equipments")
        .update(equipment.id, payload, { $autoCancel: false })
    }

    for (const facilityId of facilityIds) {
      const payload = {
        status: 2,
      }

      const res = await pb
        .collection("facilities")
        .update(facilityId, payload, { $autoCancel: false })
    }

    router.push("/finish")
  }, [selectedValues, pbUser, facilityIds, eventId])

  // parse query
  useEffect(() => {
    console.log(router.query)
    setFacilityIds(JSON.parse((router.query.facility_ids as string) || "[]"))
    setOwnerIds(JSON.parse((router.query.owner_ids as string) || "[]"))
    setEventId((router.query.event_id as string) || "")
  }, [pb])

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb || !eventId) return

      // fetch equipments
      const list = await pb.collection("event_to_equipments").getFullList({
        $autoCancel: false,
        filter: `id="${eventId}" && equipment_owner_id="${ownerIds[0]}"`, // WHERE
        expand: "equipment", // expand relation
      })

      const equipments = Object.fromEntries(
        list
          .map((item) => item.expand.equipment as EquipmentsRecord)
          .map((item) => [
            item.id,
            {
              ...item,
              _checked: false,
              _disabled: false,
            } as EquipmentCheckboxes,
          ])
      )

      setEquipments(equipments)
    })()
  }, [pb, eventId])

  // computed value
  useEffect(() => {
    setSelectedValues(Object.values(equipments).filter((item) => item._checked))
  }, [equipments])

  // render
  return (
    <TitleContentActionLayout
      title="借りる備品"
      submitText="登録"
      canSubmit={true}
      onSubmit={handleSubmit}
    >
      <FormGroup>
        {Object.values(equipments).map((item) => (
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
      {/* <pre>{JSON.stringify(equipments, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(selectedValues, null, 2)}</pre> */}
    </TitleContentActionLayout>
  )
}

export default EquipmentPage
