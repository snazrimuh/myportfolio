import type { ApiProfile } from './usePublicApi'

/**
 * Fetch the site profile once and share the result across all components.
 * `useAsyncData` deduplicates by key — both SSR and client hydration are handled.
 */
export function useProfile() {
  return useAsyncData<ApiProfile>('site-profile', () =>
    usePublicApi().fetchProfile(),
  )
}
