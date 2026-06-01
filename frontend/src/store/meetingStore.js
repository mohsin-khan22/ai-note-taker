import { create } from 'zustand'

export const useMeetingStore = create((set) => ({
  currentStep: 0,
  audioFile: null,
  modelSize: 'base',
  summaryLength: 'medium',
  summaryType: 'general',
  customInstructions: '',
  language: '',
  editedTranscript: '',
  pipelinePhase: null,
  currentMeetingId: null,
  errorMessage: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setAudioFile: (file) => set({ audioFile: file }),
  setModelSize: (size) => set({ modelSize: size }),
  setSummaryLength: (len) => set({ summaryLength: len }),
  setSummaryType: (type) => set({ summaryType: type }),
  setCustomInstructions: (text) => set({ customInstructions: text }),
  setLanguage: (lang) => set({ language: lang }),
  setEditedTranscript: (text) => set({ editedTranscript: text }),
  setPipelinePhase: (phase) => set({ pipelinePhase: phase }),
  setCurrentMeetingId: (id) => set({ currentMeetingId: id }),
  setErrorMessage: (msg) => set({ errorMessage: msg }),

  reset: () =>
    set({
      currentStep: 0,
      audioFile: null,
      editedTranscript: '',
      pipelinePhase: null,
      currentMeetingId: null,
      errorMessage: null,
    }),
}))
