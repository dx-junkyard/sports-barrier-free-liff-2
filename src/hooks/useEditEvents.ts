import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil"
import { editEventsState } from "@/store"

export const useEditEvents = () => ({
  editEvents: useRecoilValue(editEventsState),
  setEditEvents: useSetRecoilState(editEventsState),
  reset: useResetRecoilState(editEventsState),
})
