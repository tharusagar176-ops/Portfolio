import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PortfolioData } from '@/types/portfolio';
import { defaultPortfolioData } from '@/types/portfolio';
import { toast } from 'sonner';

interface PortfolioContextType {
  data: PortfolioData;
  updatePersonal: (personal: PortfolioData['personal']) => void;
  updateSocial: (social: PortfolioData['social']) => void;
  updateAbout: (about: PortfolioData['about']) => void;
  updateSkills: (skills: PortfolioData['skills']) => void;
  addProject: (project: Omit<PortfolioData['projects'][0], 'id'>) => void;
  updateProject: (id: number, project: Partial<PortfolioData['projects'][0]>) => void;
  deleteProject: (id: number) => void;
  addExperience: (experience: Omit<PortfolioData['experience'][0], 'id'>) => void;
  updateExperience: (id: number, experience: Partial<PortfolioData['experience'][0]>) => void;
  deleteExperience: (id: number) => void;
  addEducation: (education: Omit<PortfolioData['education'][0], 'id'>) => void;
  updateEducation: (id: number, education: Partial<PortfolioData['education'][0]>) => void;
  deleteEducation: (id: number) => void;
  addCertification: (cert: PortfolioData['certifications'][0]) => void;
  updateCertification: (index: number, cert: PortfolioData['certifications'][0]) => void;
  deleteCertification: (index: number) => void;
  addAchievement: (achievement: PortfolioData['achievements'][0]) => void;
  updateAchievement: (index: number, achievement: PortfolioData['achievements'][0]) => void;
  deleteAchievement: (index: number) => void;
  updateStatusBadge: (statusBadge: PortfolioData['statusBadge']) => void;
  updateSectionVisibility: (sectionVisibility: PortfolioData['sectionVisibility']) => void;
  exportData: () => string;
  importData: (jsonString: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_admin_data';

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Migrate social links from string to object format
          const migrateSocial = (social: any) => {
            if (!social) return defaultPortfolioData.social;
            const result: any = {};
            const allPlatforms = ['github', 'linkedin', 'twitter', 'leetcode', 'devto', 'facebook', 'youtube', 'instagram', 'medium', 'stackoverflow', 'discord', 'telegram', 'whatsapp', 'reddit', 'behance', 'dribbble'];
            
            for (const key of allPlatforms) {
              if (typeof social[key] === 'string') {
                result[key] = { url: social[key], visible: true };
              } else if (social[key]?.url !== undefined) {
                result[key] = { url: social[key].url, visible: social[key].visible !== false };
              } else {
                result[key] = defaultPortfolioData.social[key as keyof typeof defaultPortfolioData.social];
              }
            }
            return result;
          };

          // Migrate skills to include visible flag
          const migrateSkills = (skills: any) => {
            if (!skills) return defaultPortfolioData.skills;
            const result: any = { ...skills };
            
            // Migrate programming, frontend, backend, tools
            for (const category of ['programming', 'frontend', 'backend', 'tools']) {
              if (Array.isArray(skills[category])) {
                result[category] = skills[category].map((s: any) => ({
                  name: s.name,
                  level: s.level,
                  visible: s.visible !== undefined ? s.visible : true
                }));
              }
            }
            
            // Migrate other skills from string[] to object[]
            if (Array.isArray(skills.other)) {
              result.other = skills.other.map((s: any) => 
                typeof s === 'string' 
                  ? { name: s, visible: true }
                  : { name: s.name, visible: s.visible !== false }
              );
            }
            
            return result;
          };

          // Migrate about highlights
          const migrateAbout = (about: any) => {
            if (!about) return defaultPortfolioData.about;
            return {
              ...about,
              highlights: about.highlights?.map((h: any) => ({
                label: h.label,
                value: h.value,
                visible: h.visible !== undefined ? h.visible : true
              })) || defaultPortfolioData.about.highlights
            };
          };

          // Migrate old data to include new fields
          return {
            ...defaultPortfolioData,
            ...parsed,
            social: migrateSocial(parsed.social),
            about: migrateAbout(parsed.about),
            skills: migrateSkills(parsed.skills),
            statusBadge: parsed.statusBadge || defaultPortfolioData.statusBadge,
            sectionVisibility: parsed.sectionVisibility || defaultPortfolioData.sectionVisibility,
            // Add visible flag to items that don't have it
            projects: parsed.projects?.map((p: any) => ({ ...p, visible: p.visible !== undefined ? p.visible : true })) || defaultPortfolioData.projects,
            experience: parsed.experience?.map((e: any) => ({ ...e, visible: e.visible !== undefined ? e.visible : true })) || defaultPortfolioData.experience,
            education: parsed.education?.map((e: any) => ({ ...e, visible: e.visible !== undefined ? e.visible : true })) || defaultPortfolioData.education,
            certifications: parsed.certifications?.map((c: any) => ({ ...c, visible: c.visible !== undefined ? c.visible : true })) || defaultPortfolioData.certifications,
            achievements: parsed.achievements?.map((a: any) => ({ ...a, visible: a.visible !== undefined ? a.visible : true })) || defaultPortfolioData.achievements,
          };
        } catch {
          return defaultPortfolioData;
        }
      }
    }
    return defaultPortfolioData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updatePersonal = (personal: PortfolioData['personal']) => {
    setData(prev => ({ ...prev, personal }));
    toast.success('Personal info updated');
  };

  const updateSocial = (social: PortfolioData['social']) => {
    setData(prev => ({ ...prev, social }));
    toast.success('Social links updated');
  };

  const updateAbout = (about: PortfolioData['about']) => {
    setData(prev => ({ ...prev, about }));
    toast.success('About section updated');
  };

  const updateSkills = (skills: PortfolioData['skills']) => {
    setData(prev => ({ ...prev, skills }));
    toast.success('Skills updated');
  };

  // Projects
  const addProject = (project: Omit<PortfolioData['projects'][0], 'id'>) => {
    const newId = Math.max(0, ...data.projects.map(p => p.id)) + 1;
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: newId }],
    }));
    toast.success('Project added');
  };

  const updateProject = (id: number, project: Partial<PortfolioData['projects'][0]>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p),
    }));
    toast.success('Project updated');
  };

  const deleteProject = (id: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
    toast.success('Project deleted');
  };

  // Experience
  const addExperience = (experience: Omit<PortfolioData['experience'][0], 'id'>) => {
    const newId = Math.max(0, ...data.experience.map(e => e.id)) + 1;
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...experience, id: newId }],
    }));
    toast.success('Experience added');
  };

  const updateExperience = (id: number, experience: Partial<PortfolioData['experience'][0]>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...experience } : e),
    }));
    toast.success('Experience updated');
  };

  const deleteExperience = (id: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
    toast.success('Experience deleted');
  };

  // Education
  const addEducation = (education: Omit<PortfolioData['education'][0], 'id'>) => {
    const newId = Math.max(0, ...data.education.map(e => e.id)) + 1;
    setData(prev => ({
      ...prev,
      education: [...prev.education, { ...education, id: newId }],
    }));
    toast.success('Education added');
  };

  const updateEducation = (id: number, education: Partial<PortfolioData['education'][0]>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...education } : e),
    }));
    toast.success('Education updated');
  };

  const deleteEducation = (id: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
    toast.success('Education deleted');
  };

  // Certifications
  const addCertification = (cert: PortfolioData['certifications'][0]) => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert],
    }));
    toast.success('Certification added');
  };

  const updateCertification = (index: number, cert: PortfolioData['certifications'][0]) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map((c, i) => i === index ? cert : c),
    }));
    toast.success('Certification updated');
  };

  const deleteCertification = (index: number) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
    toast.success('Certification deleted');
  };

  // Achievements
  const addAchievement = (achievement: PortfolioData['achievements'][0]) => {
    setData(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
    }));
    toast.success('Achievement added');
  };

  const updateAchievement = (index: number, achievement: PortfolioData['achievements'][0]) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => i === index ? achievement : a),
    }));
    toast.success('Achievement updated');
  };

  const deleteAchievement = (index: number) => {
    setData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
    toast.success('Achievement deleted');
  };

  // Status Badge
  const updateStatusBadge = (statusBadge: PortfolioData['statusBadge']) => {
    setData(prev => ({ ...prev, statusBadge }));
    toast.success('Status badge updated');
  };

  // Section Visibility
  const updateSectionVisibility = (sectionVisibility: PortfolioData['sectionVisibility']) => {
    setData(prev => ({ ...prev, sectionVisibility }));
    toast.success('Section visibility updated');
  };

  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setData(parsed);
      toast.success('Data imported successfully');
    } catch {
      toast.error('Invalid JSON data');
    }
  };

  const resetData = () => {
    setData(defaultPortfolioData);
    toast.success('Data reset to defaults');
  };

  return (
    <PortfolioContext.Provider value={{
      data,
      updatePersonal,
      updateSocial,
      updateAbout,
      updateSkills,
      addProject,
      updateProject,
      deleteProject,
      addExperience,
      updateExperience,
      deleteExperience,
      addEducation,
      updateEducation,
      deleteEducation,
      addCertification,
      updateCertification,
      deleteCertification,
      addAchievement,
      updateAchievement,
      deleteAchievement,
      updateStatusBadge,
      updateSectionVisibility,
      exportData,
      importData,
      resetData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
