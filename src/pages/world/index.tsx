import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"

import { useLiff } from "@/hooks"
import { useCallback } from "react"

const World: NextPage<{}> = () => {
  const { liff, setLiff } = useLiff()
  const onClick = useCallback(
    () =>
      setLiff(() => {
        return { name: "asdf" }
      }),
    [setLiff]
  )

  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>world</h1>
        <p>{liff.name}</p>
        <Link href="/hello">Hello</Link>
        <button onClick={onClick}>set</button>
      </main>
    </div>
  )
}

export default World
