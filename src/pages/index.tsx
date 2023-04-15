import type { NextPage } from "next"

import { PageProps } from "./_app"
import styles from "../styles/Home.module.css"
import { useRouter } from "next/router"
import { Button } from "@mui/material"

const Home: NextPage<PageProps> = ({ liffProfile, pb }) => {
  const router = useRouter()

  return (
    <main className={styles.main}>
      {(!liffProfile || !pb) && <p>読込中...</p>}
      <p>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/events")}
        >
          イベント一覧
        </Button>
      </p>
      <p>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/events/_new")}
        >
          イベント作成
        </Button>
      </p>
      <p>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/scan/landing")}
        >
          QRコードスキャン
        </Button>
      </p>
      <p>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push("/portal")}
        >
          ポータル
        </Button>
      </p>
    </main>
  )
}

export default Home
