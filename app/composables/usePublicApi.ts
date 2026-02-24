interface ApiSkill {
  id: number
  name: string
  categoryId: number
}

interface ApiSkillCategory {
  id: number
  name: string
  icon: string
  color: string
  order: number
  skills: ApiSkill[]
}

interface ApiProject {
  id: number
  title: string
  description: string
  tech: string[]
  github: string | null
  liveUrl: string | null
  image: string | null
  featured: boolean
  order: number
}

interface ApiExperience {
  id: number
  title: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
  type: 'WORK' | 'INTERNSHIP' | 'EDUCATION' | 'CERTIFICATION'
  order: number
}

export type { ApiSkillCategory, ApiSkill, ApiProject, ApiExperience }

export function usePublicApi() {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase as string

  const fetchSkills = () =>
    $fetch<ApiSkillCategory[]>(`${API_BASE}/skills`)

  const fetchProjects = () =>
    $fetch<ApiProject[]>(`${API_BASE}/projects`)

  const fetchExperiences = (type?: string) => {
    const query = type ? `?type=${type}` : ''
    return $fetch<ApiExperience[]>(`${API_BASE}/experiences${query}`)
  }

  const sendContactMessage = (data: { name: string; email: string; message: string }) =>
    $fetch(`${API_BASE}/contacts`, { method: 'POST', body: data })

  return { fetchSkills, fetchProjects, fetchExperiences, sendContactMessage }
}
