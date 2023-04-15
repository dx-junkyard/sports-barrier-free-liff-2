import type { NextPage } from "next"

import { PageProps } from "@/pages/_app"
import Image from "next/image"
import { Box } from "@mui/material"

const PortalPage: NextPage<PageProps> = ({}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Image
        src="/images/portal-mock.png"
        alt="portal"
        width={305}
        height={1111}
      />
    </Box>
  )
}

export default PortalPage
