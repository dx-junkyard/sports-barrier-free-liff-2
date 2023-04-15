import { useState, useEffect } from "react"
import { RecoilRoot } from "recoil"

import type { AppProps } from "next/app"
import { Liff } from "@line/liff"
import type { Profile } from "@liff/get-profile"

import PocketBase, { Record as PbRecord } from "pocketbase"
import { Container } from "@mui/system"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "../styles/globals.css"

import { WaitProfile } from "@/components/wait-profile"
import { WaitLogin } from "@/components/wait-login"
import { MyAppBar } from "@/components/my-app-bar"

import ENV from "@/env"

interface PbUser extends PbRecord {
  line_id: string
  display_name?: string
  profile_picture?: string
}

export interface PageProps {
  liff: Liff | null
  liffError: string | null
  liffProfile: Profile | null
  pb: PocketBase | null
  pbUser: PbUser | null
}

async function doesUserExists(pb: PocketBase, email: string): Promise<boolean> {
  try {
    const user = await pb
      .collection("users")
      .getFirstListItem(`email="${email}"`)
    console.log("user", user)
    return true
  } catch (_) {
    return false
  }
}

async function registerUser(
  pb: PocketBase,
  email: string,
  password: string,
  liffProfile: Profile
): Promise<void> {
  const meta = {
    line_id: liffProfile.userId,
    profile_picture: liffProfile.pictureUrl,
    display_name: liffProfile.displayName,
  }
  const res = await pb.collection("users").create({
    email,
    password,
    passwordConfirm: password,
    verified: true,
    ...meta,
  })
  console.log("user registered", res)
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null)
  const [liffError, setLiffError] = useState<string | null>(null)
  const [liffIsLoggedIn, setIsLoggedIn] = useState(false)
  const [liffProfile, setLiffProfile] = useState<Profile | null>(null)
  const [pb, setPb] = useState<PocketBase | null>(null)
  const [pbUser, setPbUser] = useState<PbUser | null>(null)

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    if (liffObject) return

    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...")
        liff
          .init({ liffId: ENV.LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.")
            setLiffObject(liff)
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.")
            setLiffError(error.toString())
          })
      })
  }, [liffObject])

  // LIFF login
  useEffect(() => {
    ;(async () => {
      const liff = liffObject
      if (!liff) return

      const isLoggedIn = liff.isLoggedIn()
      if (isLoggedIn) {
        setIsLoggedIn(true)
        return
      }
      console.log("liff login")
      liff.login({ redirectUri: window.location.href })
    })()
  }, [liffObject])

  // LIFF get profile
  useEffect(() => {
    ;(async () => {
      const liff = liffObject
      if (!liff || !liffIsLoggedIn) return

      console.log("liff getprofile")
      const profile = await liff.getProfile()
      console.log(profile)
      setLiffProfile(profile)
    })()
  }, [liffObject, liffIsLoggedIn])

  useEffect(() => {
    ;(async () => {
      if (pb || !liffProfile) return
      const _pb = new PocketBase(ENV.PB_HOST)

      // TODO: adminとしてログイン
      await _pb.admins.authWithPassword(
        ENV.PB_ADMIN_EMAIL,
        ENV.PB_ADMIN_PASSWORD
      )

      const email = `${liffProfile.userId}@liff-app.local`
      const isUserExists = await doesUserExists(_pb, email)
      console.log("isUserExists", isUserExists)

      const password = ENV.PB_USER_DEFAULT_PASSWORD
      if (!isUserExists) {
        registerUser(_pb, email, password, liffProfile)
      }
      await _pb.authStore.clear()

      // TODO: LINEユーザーでログイン
      const userRecord = await _pb.collection("users").authWithPassword<PbUser>(email, password)
      setPbUser(userRecord.record)

      setPb(_pb)
    })()
  }, [liffProfile, pb])

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject
  pageProps.liffError = liffError
  pageProps.liffProfile = liffProfile
  pageProps.pb = pb
  pageProps.pbUser = pbUser

  return (
    <RecoilRoot>
      <WaitProfile
        liff={liffObject}
        liffError={liffError}
        liffProfile={liffProfile}
      >
        <WaitLogin liffProfile={liffProfile} pb={pb}>
          <MyAppBar liff={liffObject} liffProfile={liffProfile} pbUser={pbUser} />

          <Container sx={{ py: 2, maxWidth: "400px" }}>
            {/* Your page content here */}
            <Component {...pageProps} />
          </Container>
        </WaitLogin>
      </WaitProfile>
    </RecoilRoot>
  )
}

export default MyApp
