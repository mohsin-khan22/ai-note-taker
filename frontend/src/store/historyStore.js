import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_MEETINGS = 50

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      meetings: [],

      saveMeeting: (meeting) => {
        const id = meeting.id || crypto.randomUUID()
        const entry = {
          id,
          title: meeting.title || 'Untitled Meeting',
          date: meeting.date || new Date().toISOString(),
          transcript: meeting.transcript,
          wordCount: meeting.wordCount,
          durationSeconds: meeting.durationSeconds,
          languageDetected: meeting.languageDetected,
          segments: meeting.segments || [],
          summary: meeting.summary,
          keyPoints: meeting.keyPoints || [],
          actionItems: meeting.actionItems || [],
          entities: meeting.entities || {
            people: [],
            dates: [],
            organizations: [],
            locations: [],
          },
          summaryLength: meeting.summaryLength,
          summaryType: meeting.summaryType,
        }
        set((state) => {
          const filtered = state.meetings.filter((m) => m.id !== id)
          return {
            meetings: [entry, ...filtered].slice(0, MAX_MEETINGS),
          }
        })
        return id
      },

      getMeeting: (id) => get().meetings.find((m) => m.id === id),

      deleteMeeting: (id) =>
        set((state) => ({
          meetings: state.meetings.filter((m) => m.id !== id),
        })),

      updateActionItems: (id, actionItems) =>
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === id ? { ...m, actionItems } : m
          ),
        })),
    }),
    { name: 'ai-notetaker-meetings' }
  )
)
