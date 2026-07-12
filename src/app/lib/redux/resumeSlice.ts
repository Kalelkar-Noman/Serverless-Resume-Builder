import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'lib/redux/store';
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from 'lib/redux/types';
import type { ShowForm } from 'lib/redux/settingsSlice';

/**
 * Initial empty state for the user's Profile section
 */
export const initialProfile: ResumeProfile = {
  name: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  url: '',
};

/**
 * Initial empty state for a single Work Experience entry
 */
export const initialWorkExperience: ResumeWorkExperience = {
  company: '',
  jobTitle: '',
  date: '',
  descriptions: [],
};

/**
 * Initial empty state for a single Education entry
 */
export const initialEducation: ResumeEducation = {
  school: '',
  degree: '',
  gpa: '',
  date: '',
  descriptions: [],
};

/**
 * Initial empty state for a single Project entry
 */
export const initialProject: ResumeProject = {
  project: '',
  date: '',
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = { skill: '', rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});

/**
 * Initial empty state for the Skills section
 */
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

/**
 * Initial empty state for a custom text section
 */
export const initialCustom = {
  descriptions: [],
};

/**
 * The complete initial state tree for the Resume Builder
 */
export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
  customSections: {},
};

/**
 * Utility type to represent an action that changes a specific field
 * in a section (e.g. Work Experience, Education) at a specific index.
 */
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, 'descriptions'>;
      value: string;
    }
  | { field: 'descriptions'; value: string[] }
);

/**
 * Redux Slice handling all Resume data manipulations.
 * Uses Redux Toolkit's 'immer' under the hood to safely mutate state.
 */
export const resumeSlice = createSlice({
  name: 'resume',
  initialState: initialResumeState,
  reducers: {
    changeProfile: (
      draft,
      action: PayloadAction<{ field: keyof ResumeProfile; value: string | string[] }>
    ) => {
      const { field, value } = action.payload;
      draft.profile[field] = value as any;
    },
    changeWorkExperiences: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeWorkExperience>>
    ) => {
      const { idx, field, value } = action.payload;
      const workExperience = draft.workExperiences[idx];
      workExperience[field] = value as any;
    },
    changeEducations: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeEducation>>
    ) => {
      const { idx, field, value } = action.payload;
      const education = draft.educations[idx];
      education[field] = value as any;
    },
    changeProjects: (
      draft,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>
    ) => {
      const { idx, field, value } = action.payload;
      const project = draft.projects[idx];
      project[field] = value as any;
    },
    changeSkills: (
      draft,
      action: PayloadAction<
        | { field: 'descriptions'; value: string[] }
        | {
            field: 'featuredSkills';
            idx: number;
            skill: string;
            rating: number;
          }
      >
    ) => {
      const { field } = action.payload;
      if (field === 'descriptions') {
        const { value } = action.payload;
        draft.skills.descriptions = value;
      } else {
        const { idx, skill, rating } = action.payload;
        const featuredSkill = draft.skills.featuredSkills[idx];
        featuredSkill.skill = skill;
        featuredSkill.rating = rating;
      }
    },
    changeCustom: (
      draft,
      action: PayloadAction<{ field: 'descriptions'; value: string[]; id?: string }>
    ) => {
      const { value, id } = action.payload;
      if (id && id !== 'custom') {
        if (!draft.customSections) draft.customSections = {};
        if (!draft.customSections[id]) draft.customSections[id] = structuredClone(initialCustom);
        draft.customSections[id].descriptions = value;
      } else {
        draft.custom.descriptions = value;
      }
    },
    addDynamicCustomSection: (draft, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (!draft.customSections) draft.customSections = {};
      draft.customSections[id] = structuredClone(initialCustom);
    },
    deleteDynamicCustomSection: (draft, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      if (draft.customSections && draft.customSections[id]) {
        delete draft.customSections[id];
      }
    },
    addSectionInForm: (draft, action: PayloadAction<{ form: ShowForm }>) => {
      const { form } = action.payload;
      switch (form) {
        case 'workExperiences': {
          draft.workExperiences.push(structuredClone(initialWorkExperience));
          return draft;
        }
        case 'educations': {
          draft.educations.push(structuredClone(initialEducation));
          return draft;
        }
        case 'projects': {
          draft.projects.push(structuredClone(initialProject));
          return draft;
        }
      }
    },
    moveSectionInForm: (
      draft,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: 'up' | 'down';
      }>
    ) => {
      const { form, idx, direction } = action.payload;
      if (form !== 'skills' && form !== 'custom' && !form.startsWith('custom')) {
        const formKey = form as 'workExperiences' | 'educations' | 'projects';
        if (
          (idx === 0 && direction === 'up') ||
          (idx === draft[formKey].length - 1 && direction === 'down')
        ) {
          return draft;
        }

        const section = draft[formKey][idx];
        if (direction === 'up') {
          draft[formKey][idx] = draft[formKey][idx - 1];
          draft[formKey][idx - 1] = section;
        } else {
          draft[formKey][idx] = draft[formKey][idx + 1];
          draft[formKey][idx + 1] = section;
        }
      }
    },
    deleteSectionInFormByIdx: (draft, action: PayloadAction<{ form: ShowForm; idx: number }>) => {
      const { form, idx } = action.payload;
      if (form !== 'skills' && form !== 'custom' && !form.startsWith('custom')) {
        const formKey = form as 'workExperiences' | 'educations' | 'projects';
        draft[formKey].splice(idx, 1);
      }
    },
    setResume: (draft, action: PayloadAction<Resume>) => {
      return action.payload;
    },
  },
});

export const {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  addDynamicCustomSection,
  deleteDynamicCustomSection,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeSlice.actions;

// Selectors
export const selectResume = (state: RootState) => state.resume;
export const selectProfile = (state: RootState) => state.resume.profile;
export const selectWorkExperiences = (state: RootState) => state.resume.workExperiences;
export const selectEducations = (state: RootState) => state.resume.educations;
export const selectProjects = (state: RootState) => state.resume.projects;
export const selectSkills = (state: RootState) => state.resume.skills;
export const selectCustom = (state: RootState) => state.resume.custom;

export default resumeSlice.reducer;
