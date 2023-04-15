import { atom } from 'recoil'

interface Props {
  name: string
}

export const liffState = atom<Props>({
  key: 'liff',
  default: { name: 'Anonymous' },
})
