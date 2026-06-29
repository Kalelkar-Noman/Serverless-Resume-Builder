export interface CustomLink {
  label: string;
  url: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  customLinks: CustomLink[];
}

export interface TimelineItem {
  headline: string;
  subheading?: string;
  date?: string;
  description?: string; // Can hold rich text/HTML
}

export interface SkillsGridItem {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'; // Optional skill level
  tags?: string[]; // e.g., ['framework', 'language', 'tool']
}

export type SectionType = 'timeline' | 'skills-grid' | 'custom-rich-text';

export interface ResumeSection {
  id: string;
  title: string;
  type: SectionType;
  // Dynamic fields based on type
  items?: TimelineItem[]; // For 'timeline'
  skillTags?: SkillsGridItem[]; // For 'skills-grid'
  customHtmlContent?: string; // For 'custom-rich-text' (can hold rich text/HTML)
}

export interface ResumeDesign {
  text: string;
  background: string;
  highlight: string;
  surface: string;
  font: string; // Font family string (e.g. 'font-sans', 'font-serif', 'font-mono')
  documentSize?: 'a4' | 'letter';
  margins?: 'standard' | 'narrow' | 'none';
}

export interface ResumeData {
  templateId?: 'base' | 'modern' | 'terminal' | 'minimalist';
  design?: ResumeDesign;
  personalInfo: PersonalInfo;
  summary: string; // Rich Text HTML
  sections: ResumeSection[];
}
