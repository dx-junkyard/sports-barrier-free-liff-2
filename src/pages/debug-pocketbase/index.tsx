import { useCallback, useEffect, useState } from "react"
import type { NextPage } from "next"
import PocketBase from "pocketbase"

import ENV from "@/env"
import { PageProps } from "@/pages/_app"

const ruleAllowAuthenticated = {
  listRule: '@request.auth.id != ""',
  viewRule: '@request.auth.id != ""',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
}

async function clearCollection(pb: PocketBase) {
  const collections = await pb.collections.getList()
  await Promise.all(
    collections.items.map((item) => pb.collections.delete(item.id))
  )
}

async function createCollections(pb: PocketBase) {
  // Equipments
  await pb.collections.create({
    name: "equipments",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "picture_path",
        type: "text",
      },
      {
        name: "status",
        type: "number",
      },
      {
        name: "equipment_user_id",
        type: "text",
      },
    ],
    ...ruleAllowAuthenticated,
  })

  // Events
  await pb.collections.create({
    name: "events",
    type: "base",
    schema: [
      {
        name: "title",
        type: "text",
        required: true,
      },
      {
        name: "time_from",
        type: "date",
        required: true,
      },
      {
        name: "time_to",
        type: "date",
        required: true,
      },
      {
        name: "creator_user_id",
        type: "text",
      },
      {
        name: "equipment_ids",
        type: "json",
      },
      {
        name: "facility_ids",
        type: "json",
      },
    ],
    ...ruleAllowAuthenticated,
  })

  // Facilities
  await pb.collections.create({
    name: "facilities",
    type: "base",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "picture_path",
        type: "text",
      },
      {
        name: "status",
        type: "number",
      },
    ],
    ...ruleAllowAuthenticated,
  })

  // Users
  await pb.collections.create({
    name: "users",
    type: "auth",
    options: {
      allowEmailAuth: true,
      allowUsernameAuth: true,
      minPasswordLength: 8,
    },
    schema: [
      {
        name: "line_id",
        type: "text",
        required: true,
      },
      {
        name: "display_name",
        type: "text",
      },
      {
        name: "profile_picture",
        type: "text",
      },
    ],
    ...ruleAllowAuthenticated,
    updateRule: null,
    deleteRule: null,
  })

  await pb.collection("users").create({
    email: "bom@bom.com",
    password: "1234567890",
    passwordConfirm: "1234567890",
    verified: true,
    line_id: "U12345",
  })
}

async function insertFacilities(pb: PocketBase) {
  const collection = "facilities"
  const list = [
    ["西東京市スポーツセンター（ランニング走路）", 0],
    ["西東京市スポーツセンター（トレーニング室）", 0],
    ["西東京市スポーツセンター（プール）", 0],
    ["南町スポーツ・文化交流センターきらっと", 0],
    ["西東京市総合体育館（体育館）", 0],
    ["西東京市総合体育館（トレーニングルーム）", 0],
    ["武道場", 0],
    ["芝久保第二運動場", 0],
    ["芝久保運動場", 0],
  ]

  for (const [name, status] of list) {
    await pb.collection(collection).create({
      name,
      picture_path: null,
      status,
    })
  }
}

async function insertEvents(pb: PocketBase) {
  const collection = "events"
  const list = [
    [
      "西東京市体育館ボッチャ体験会６月",
      "2023-06-01 10:00:00",
      "2023-06-01 12:00:00",
    ],
    ["個人 or チーム貸出", "2023-06-02 10:00:00", "2023-06-02 12:00:00"],
  ]

  // "2023-06-01 10:00:00" --> "2023-06-01T10:00:00+09:00"
  const asAsiaTokyoTZ = (time: string) => time.replace(" ", "T") + "+09:00"

  for (const [title, time_from, time_to] of list) {
    await pb.collection(collection).create({
      title,
      time_from: asAsiaTokyoTZ(time_from),
      time_to: asAsiaTokyoTZ(time_to),
    })
  }
}

async function insertEquipments(pb: PocketBase) {
  const collection = "equipments"
  const list = [
    ["ボッチャ", 0],
    ["コーフボール", 0],
    ["サッカーボール", 0],
    ["バレーボール", 0],
  ]

  for (const [name, status] of list) {
    await pb.collection(collection).create({
      name,
      picture_path: null,
      status,
    })
  }
}

const DebugPocketBase: NextPage<PageProps> = ({ pb: pagePb }) => {
  const [pb, setPb] = useState<PocketBase | null>(null)
  const [message, setMessage] = useState<string>("ready")

  // init pb
  useEffect(() => {
    ;(async () => {
      if (pb) return

      const _pb = new PocketBase(ENV.PB_HOST)
      await _pb.admins.authWithPassword(
        ENV.PB_ADMIN_EMAIL,
        ENV.PB_ADMIN_PASSWORD
      )
      setPb(_pb)
    })()
  }, [pb])

  const onClickInit = useCallback(async () => {
    if (!pb) return

    const names = (await pb.collections.getList()).items.map((_) => _.name)
    setMessage(JSON.stringify(names, null, 2))

    const confirmed = confirm(
      "all collection will be deleted. continue?\n\n" + names
    )
    if (!confirmed) return

    await clearCollection(pb)
    await createCollections(pb)
    await insertFacilities(pb)
    await insertEquipments(pb)
    await insertEvents(pb)

    setMessage("initialize complete")
  }, [pb])

  const onClickLogin = useCallback(async () => {
    if (!pb) return

    const res = await pb
      .collection("users")
      .authWithPassword("bom@bom.com", "1234567890")
    console.log(res)
    setMessage(JSON.stringify(pb.authStore, null, 2))
  }, [pb])

  const onClickShowEnv = useCallback(async () => {
    if (!pb) return

    setMessage(JSON.stringify(ENV, null, 2))
  }, [pb])

  const onClickQuery = useCallback(async () => {
    if (!pb) return

    const res = await pb
      .collection("event_to_equipments")
      .getFullList({ $autoCancel: false, expand: "equipment" })

    console.log(res)
    setMessage(JSON.stringify(res, null, 2))
  }, [pb])

  const onClickResetAll = useCallback(async () => {
    if (!pb) return

    const confirmed = confirm("all status will be 0")
    if (!confirmed) return

    const resetPayload = { status: 0 }
    const equipments = await pb
      .collection("equipments")
      .getFullList({ $autoCancel: false })
    for (const equipment of equipments) {
      await pb.collection("equipments").update(equipment.id, resetPayload)
    }

    const facilities = await pb
      .collection("facilities")
      .getFullList({ $autoCancel: false })
    for (const facility of facilities) {
      await pb.collection("facilities").update(facility.id, resetPayload)
    }

    setMessage(JSON.stringify({ equipments, facilities }, null, 2))
  }, [pb])

  return (
    <div>
      <div>
        <p>Current Authenticate</p>
        <pre>{pb && JSON.stringify(pb.authStore["baseModel"], null, 2)}</pre>
      </div>
      <div>
        Initialize DB
        <button onClick={onClickInit}>init</button>
      </div>
      <div>
        Test Login with Bob
        <button onClick={onClickLogin}>login</button>
      </div>
      <div>
        Show environment values
        <button onClick={onClickShowEnv}>show env</button>
      </div>
      <div>
        Test PocketBase query
        <button onClick={onClickQuery}>query</button>
      </div>
      <div>
        Reset all status
        <button onClick={onClickResetAll}>reset</button>
      </div>
      <div>
        <pre>{message}</pre>
      </div>
    </div>
  )
}

export default DebugPocketBase
