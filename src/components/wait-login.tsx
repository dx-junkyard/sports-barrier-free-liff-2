import { PageProps } from "@/pages/_app"
import React from "react"

interface Props extends Pick<PageProps,  "liffProfile" | "pb"> {
  children: React.ReactNode
}

export const WaitLogin: React.FC<Props> = ({
  liffProfile,
  pb,
  children
}) => {
  return (
    <>
      {!liffProfile && <p>プロフィール未取得</p>}
      {liffProfile && <>
        {!pb && <p>ログイン中</p>}
        {pb && children}
      </>
      }
    </>
  )
}
