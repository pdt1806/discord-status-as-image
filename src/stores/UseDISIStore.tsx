import { create } from 'zustand';
import { DISIStore } from '../utils/types';

export const useDISIStore = create<DISIStore>()((set) => ({
  smallCardLink: '',
  largeCardLink: '',
  smallTail: '',
  largeTail: '',
  userID: '',
  colorMode: 'Single',
  wantLargeCard: false,
  bannerMode: 'Custom Color',
  customBannerMode: '',
  externalImageURL: '',
  bannerPBID: '',
  bannerFile: null,

  // Setters
  setSmallCardLink: (v) => set({ smallCardLink: v }),
  setLargeCardLink: (v) => set({ largeCardLink: v }),
  setSmallTail: (v) => set({ smallTail: v }),
  setLargeTail: (v) => set({ largeTail: v }),
  setUserID: (v) => set({ userID: v }),
  setColorMode: (v) => set({ colorMode: v }),
  setWantLargeCard: (v) => set({ wantLargeCard: v }),
  setBannerMode: (v) => set({ bannerMode: v }),
  setCustomBannerMode: (v) => set({ customBannerMode: v }),
  setExternalImageURL: (v) => set({ externalImageURL: v }),
  setBannerPBID: (v) => set({ bannerPBID: v }),
  setBannerFile: (file) => set({ bannerFile: file }),
}));
