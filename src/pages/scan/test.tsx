import type { NextPage } from "next"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
import { PageProps } from "@/pages/_app"
import { TitleContentActionLayout } from "@/components/title-content-action-layout"

const QRPage: NextPage<PageProps> = ({ pb, liff }) => {
  const [status, setStatus] = useState<any>({ initial: true })

  const router = useRouter()

  const handleSubmit = useCallback(async () => {
    if (!liff) {
      setStatus({ error: "liff instance invalid" })
      return
    }
    try {
      const result = await liff.scanCodeV2()
      setStatus({ message: "success,", ...result })
    } catch (error) {
      setStatus({ message: "error,", error })
    }
  }, [liff])

  // render
  return (
    <TitleContentActionLayout
      title="スキャンする"
      submitText="スキャン"
      canSubmit={true}
      onSubmit={handleSubmit}
    >
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </TitleContentActionLayout>
  )
}

export default QRPage
