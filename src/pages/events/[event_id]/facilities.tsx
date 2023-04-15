import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"

import { FormGroup, FormControlLabel, Checkbox } from "@mui/material"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { useRouter } from "next/router"
import { useEditEvents } from "@/hooks"

export interface Facilities {
  id: string
  name: string
  picture_path: string | null
  status: number
}

export interface FacilitiesCheckboxes extends Facilities {
  _checked: boolean
  _disabled: boolean
}

const enum STATE {
  INIT,
  PB_LOADED,
  STORE_LOADED,
}

const FacilitiesPage: NextPage<PageProps> = ({ liff, pb }) => {
  const [facilities, setFacilities] = useState<
    Record<string, FacilitiesCheckboxes>
  >({})
  const [selectedFacilities, setSelectedFacilities] = useState<
    FacilitiesCheckboxes[]
  >([])
  const [state, setState] = useState(STATE.INIT)
  const { editEvents, setEditEvents } = useEditEvents()

  const router = useRouter()

  // events
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
    const facilityIds = Object.values(selectedFacilities).map(
      (facility) => facility.id
    )
    setEditEvents(() => ({ ...editEvents, facilityIds: facilityIds }))

    const { event_id } = router.query
    router.push(`/events/${event_id}/confirm`)
  }, [selectedFacilities])

  const handleCancel = useCallback(() => {
    history.length ? history.back() : liff?.closeWindow()
  }, [])

  // on page load
  useEffect(() => {
    ;(async () => {
      if (!pb) return

      // fetch equipments
      const list = await pb
        .collection("facilities")
        .getFullList({ $autoCancel: false })

      // apply to state
      const facilities = Object.fromEntries(
        list.map((item) => [
          item.id,
          {
            id: item.id,
            name: item.name,
            picture_path: item.picture_path,
            status: item.status,
            _checked: false,
            _disabled: item.status !== 0,
          },
        ])
      )
      setFacilities(facilities)
      setState(STATE.PB_LOADED)
    })()
  }, [pb])

  // on db.equipments loaded
  useEffect(() => {
    if (!Object.keys(facilities).length || state != STATE.PB_LOADED) return
    editEvents.facilityIds.forEach((id) => {
      facilities[id]._checked = true
    })

    setFacilities({ ...facilities })
    setState(STATE.STORE_LOADED)
  }, [facilities, editEvents, state])

  // computed value
  useEffect(() => {
    setSelectedFacilities(
      Object.values(facilities).filter((item) => item._checked)
    )
  }, [facilities])

  // render
  return (
    <TitleContentActionLayout
      title="場所を選ぶ"
      submitText="登録"
      canSubmit={!!selectedFacilities.length}
      onCancel={handleCancel}
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
    </TitleContentActionLayout>
  )
}

export default FacilitiesPage
