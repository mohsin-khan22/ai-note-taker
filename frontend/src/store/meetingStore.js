import { create } from 'zustand'

export const useMeetingStore = create((set) => ({
  currentStep: 0,
  audioFile: null,
  modelSize: 'base',
  summaryLength: 'medium',
  language: '',
  isRecording: false,
  errorMessage: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setAudioFile: (file) => set({ audioFile: file }),
  setModelSize: (size) => set({ modelSize: size }),
  setSummaryLength: (len) => set({ summaryLength: len }),
  setLanguage: (lang) => set({ language: lang }),
  setIsRecording: (bool) => set({ isRecording: bool }),
  setErrorMessage: (msg) => set({ errorMessage: msg }),
  
  reset: () => set({
    currentStep: 0,
    audioFile: null,
    isRecording: false,
    errorMessage: null,
  })
}))
