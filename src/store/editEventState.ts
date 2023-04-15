import { atom } from "recoil"

interface EditEventsProps {
  title: string | null
  creatorId: string | null
  equipmentIds: string[]
  facilityIds: string[]
  time_from: string
  time_to: string
}

export const editEventsState = atom<EditEventsProps>({
  key: "editEvents",
  default: {
    title: null,
    creatorId: null,
    equipmentIds: [],
    facilityIds: [],
    time_from: "",
    time_to: "",
  },
})
