import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"

import { FormGroup, FormControlLabel, Checkbox } from "@mui/material"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { useRouter } from "next/router"
import { useEditEvents } from "@/hooks"

export interface Equipments {
  id: string
  name: string
  picture_path: string | null
  status: number
  equipment_user_id: string | null
  owner_id: string
}

export interface EquipmentCheckboxes extends Equipments {
  _checked: boolean
  _disabled: boolean
}

const enum STATE {
  INIT,
  PB_LOADED,
  STORE_LOADED,
}

const EquipmentsPage: NextPage<PageProps> = ({ liff, pb }) => {
  const [equipments, setEquipments] = useState<
    Record<string, EquipmentCheckboxes>
  >({})
  const [selectedEquipments, setSelectedEquipments] = useState<
    EquipmentCheckboxes[]
  >([])
  const [state, setState] = useState(STATE.INIT)
  const { editEvents, setEditEvents } = useEditEvents()

  const router = useRouter()

  // events
  const handleChange = useCallback(
    (id: string) => {
      const equipment = equipments[id]
      if (!equipment) throw Error("equipment id not found")

      equipment._checked = !equipment._checked

      setEquipments({ ...equipments, [id]: equipment })
    },
    [equipments]
  )

  const handleSubmit = useCallback(() => {
    const equipmentIds = Object.values(selectedEquipments).map(
      (equipment) => equipment.id
    )
    setEditEvents(() => ({ ...editEvents, equipmentIds }))

    const { event_id } = router.query
    router.push(`/events/${event_id}/datetime`)
  }, [selectedEquipments])

  const handleCancel = useCallback(() => {
    history.length ? history.back() : liff?.closeWindow()
  }, [])

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb) return

      // fetch equipments
      const list = await pb
        .collection("equipments")
        .getFullList({ $autoCancel: false, sort: "+name" })

      // apply to state
      const equipments = Object.fromEntries(
        list.map((item) => [
          item.id,
          {
            id: item.id,
            name: item.name,
            picture_path: item.picture_path,
            status: item.status,
            equipment_user_id: item.equipment_user_id,
            owner_id: item.owner_id,
            _checked: false,
            _disabled: item.status !== 0,
          },
        ])
      )
      setEquipments(equipments)
      setState(STATE.PB_LOADED)
    })()
  }, [pb])

  // on db.equipments loaded
  useEffect(() => {
    if (!Object.keys(equipments).length || state != STATE.PB_LOADED) return
    editEvents.equipmentIds.forEach((id) => {
      equipments[id]._checked = true
    })

    setEquipments({ ...equipments })
    setState(STATE.STORE_LOADED)
  }, [equipments, editEvents, state])

  // computed value
  useEffect(() => {
    setSelectedEquipments(
      Object.values(equipments).filter((item) => item._checked)
    )
  }, [equipments])

  // render
  return (
    <TitleContentActionLayout
      title="備品を選ぶ"
      submitText="登録"
      canSubmit={true}
      onCancel={handleCancel}
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
    </TitleContentActionLayout>
  )
}

export default EquipmentsPage
