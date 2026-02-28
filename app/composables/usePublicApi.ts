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

type ProjectCategory = 'BACKEND' | 'FULLSTACK' | 'MOBILE' | 'ML_DL'

interface ApiProject {
  id: number
  title: string
  description: string
  tech: string[]
  category: ProjectCategory
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

interface AboutCard {
  title: string
  description: string
}

interface ApiProfile {
  id: number
  nameFirst: string
  nameSecond: string
  roles: string[]
  tagline: string
  bio: string
  location: string
  email: string
  degree: string
  freelanceAvailable: boolean
  openToWork: boolean
  resumeUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  siteTitle: string
  siteDescription: string
  aboutCards: AboutCard[]
  skillsTagline: string
  resumeTagline: string
  projectsTagline: string
  contactIntro: string
}

export type { ApiSkillCategory, ApiSkill, ApiProject, ApiExperience, ProjectCategory, ApiProfile, AboutCard }

export function usePublicApi() {
  const config = useRuntimeConfig()
  // On server (SSR/Docker): use internal network URL if set, otherwise fall back to public
  const API_BASE = (import.meta.server && config.apiBaseInternal)
    ? (config.apiBaseInternal as string)
    : (config.public.apiBase as string)

  const fetchProfile = () =>
    $fetch<ApiProfile>(`${API_BASE}/profile`)

  const fetchSkills = () =>
    $fetch<ApiSkillCategory[]>(`${API_BASE}/skills`)

  const fetchProjects = (category?: ProjectCategory) => {
    const query = category ? `?category=${category}` : ''
    return $fetch<ApiProject[]>(`${API_BASE}/projects${query}`)
  }

  const fetchExperiences = (type?: string) => {
    const query = type ? `?type=${type}` : ''
    return $fetch<ApiExperience[]>(`${API_BASE}/experiences${query}`)
  }

  const sendContactMessage = (data: { name: string; email: string; message: string }) =>
    $fetch(`${API_BASE}/contacts`, { method: 'POST', body: data })

  return { fetchProfile, fetchSkills, fetchProjects, fetchExperiences, sendContactMessage }
}
