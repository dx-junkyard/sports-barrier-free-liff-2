import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil'
import { liffState } from '@/store'

export const useLiff = () => ({
  liff: useRecoilValue(liffState),
  setLiff: useSetRecoilState(liffState),
  reset: useResetRecoilState(liffState),
})
