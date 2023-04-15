import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ja"

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import { Stack } from "@mui/material"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { MyTimeRangeSelect } from "@/components/my-time-range-select"
import { useEditEvents } from "@/hooks"

const DateTimePage: NextPage<PageProps> = ({ liff, pb }) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs())
  const [timeRange, setTimeRange] = useState<string>("10:00 - 12:00")
  const { editEvents, setEditEvents } = useEditEvents()

  const router = useRouter()

  // events
  const handleSubmit = useCallback(() => {
    const range = timeRange.split("-").map((s) => s.trim())
    const time_from = dayjs(value).hour(parseInt(range[0].slice(0, 2), 10))
    const time_to = dayjs(value).hour(parseInt(range[1].slice(0, 2), 10))

    setEditEvents(() => ({
      ...editEvents,
      time_from: time_from.format(),
      time_to: time_to.format(),
    }))

    const { event_id } = router.query
    router.push(`/events/${event_id}/facilities`)
  }, [value, timeRange])

  const handleCancel = useCallback(() => {
    history.length ? history.back() : liff?.closeWindow()
  }, [])

  // on db.equipments loaded
  useEffect(() => {
    const from = dayjs(editEvents.time_from)
    const to = dayjs(editEvents.time_to)
    setValue(dayjs(from.format("YYYY-MM-DD")))

    const range = `${from.format("HH:mm")} - ${to.format("HH:mm")}`
    setTimeRange(range)
  }, [editEvents])

  // render
  return (
    <TitleContentActionLayout
      title="日時を選ぶ"
      submitText="登録"
      canSubmit={true}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <Stack spacing={3}>
          <DatePicker
            format="YYYY年 M月 D日"
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />

          <MyTimeRangeSelect
            value={timeRange}
            onChange={(value) => setTimeRange(value)}
          />
        </Stack>
      </LocalizationProvider>
    </TitleContentActionLayout>
  )
}

export default DateTimePage
