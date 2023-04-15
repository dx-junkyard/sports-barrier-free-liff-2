import { PageProps } from "@/pages/_app"
import React from "react"

interface Props extends Pick<PageProps, "liff" | "liffError" | "liffProfile"> {
  children: React.ReactNode
}

export const WaitProfile: React.FC<Props> = ({
  liff,
  liffError,
  liffProfile,
  children,
}) => {
  return (
    <>
      {!liffError && (
        <>
          {liff && !liffProfile && <p>プロフィール取得中</p>}
          {liff && liffProfile && <>{children}</>}
        </>
      )}
      {liffError && <p>{liffError}</p>}
    </>
  )
}
