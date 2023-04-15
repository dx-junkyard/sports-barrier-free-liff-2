import { useLiff } from "@/hooks"
import type { NextPage } from "next"
import Head from "next/head"
import Link from 'next/link'

const Hello: NextPage<{}> = () => {
  const { liff } = useLiff()
  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1>hello</h1>
        <p>{liff.name}</p>
        <Link href='/world'>World</Link>
      </main>
    </div>
  )
}

export default Hello
