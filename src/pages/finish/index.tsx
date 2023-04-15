import type { NextPage } from "next"

import { PageProps } from "@/pages/_app"
import { Button, Box, Typography, Stack } from "@mui/material"

const FinishPage: NextPage<PageProps> = ({}) => {
  function closeWindow() {
    window.location.href = "https://line.me/R/ti/p/@713vamit"
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Stack spacing={8} sx={{ mt: 4 }}>
        <Typography variant="body1">
          完了しました。ボタンを押してアプリを終了します
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            closeWindow()
          }}
        >
          閉じる
        </Button>
        <Typography variant="subtitle2" color={'gray'}>
          QRコードは株式会社デンソーウェーブの登録商標です。
        </Typography>
      </Stack>
    </Box>
  )
}

export default FinishPage
