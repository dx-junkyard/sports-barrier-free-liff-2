import type { NextPage } from "next"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"
import { Link, Typography } from "@mui/material"

export interface Owner {
  id: string
  name: string
}

interface OwnerCheckboxes extends Owner {
  _checked: boolean
  _disabled: boolean
}

const QRPage: NextPage<PageProps> = ({ liff }) => {
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // start scanner
  const handleSubmit = useCallback(async () => {
    if (!liff) return
    try {
      const { value } = await liff.scanCodeV2()
      if (value) setCode(value)
      else {
        setError("キャンセルされました")
      }
    } catch (error) {
      setCode(null)
      setError(`${error}`)
    }
  }, [liff])

  // react to code update
  useEffect(() => {
    if (!code) return

    router.push({
      pathname: "/scan/facility",
      query: {
        owner_ids: JSON.stringify([code]),
        event_id: router.query.event_id,
      },
    })
  }, [code])

  // render
  return (
    <TitleContentActionLayout
      title="チェックイン"
      submitText="スキャンする"
      canSubmit={true}
      onSubmit={handleSubmit}
    >
      <Typography variant="body1">
        スキャンボタンを押して二次元バーコードをスキャンします
      </Typography>
      {error && (
        <>
          <Typography variant="body1">
            エラーが発生しました： {error}
            <Link
              onClick={() => {
                router.push({
                  pathname: "/scan/qr-select",
                  query: {
                    event_id: router.query.event_id
                  },
                });
              }}
            >
              一覧から選ぶ
            </Link>
          </Typography>
        </>
      )}
    </TitleContentActionLayout>
  )
}

export default QRPage
