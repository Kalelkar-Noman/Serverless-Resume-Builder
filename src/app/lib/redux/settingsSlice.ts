import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'lib/redux/store';

/**
 * Global application settings state, containing visual design tokens,
 * typography choices, and visibility flags for various resume sections.
 */
export interface Settings {
  templateId: 'base' | 'tech';
  themeColor: string; // Used as the primary/highlight color for backward compatibility
  design: {
    highlight: string;
    text: string;
    background: string;
    surface: string;
  };
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
    [key: string]: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
    [key: string]: string;
  };
  formsOrder: string[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
    [key: string]: boolean;
  };
}

export type ShowForm = string;
export type FormWithBulletPoints = string;
export type GeneralSetting = Exclude<
  keyof Settings,
  'formToShow' | 'formToHeading' | 'formsOrder' | 'showBulletPoints' | 'design' | 'templateId'
>;

export const DEFAULT_THEME_COLOR = '#38bdf8'; // sky-400
export const DEFAULT_FONT_FAMILY = 'Roboto';
export const DEFAULT_FONT_SIZE = '11'; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = '#171717'; // text-neutral-800

/**
 * Initial empty settings payload for the Redux slice.
 * Note: When a user visits the app for the first time, these are merged
 * with the Redux local storage persister inside `lib/redux/hooks.tsx`.
 */
export const initialSettings: Settings = {
  templateId: 'base',
  themeColor: DEFAULT_THEME_COLOR,
  design: {
    highlight: DEFAULT_THEME_COLOR,
    text: DEFAULT_FONT_COLOR,
    background: '#ffffff',
    surface: '#f8fafc',
  },
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: 'Letter',
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: 'WORK EXPERIENCE',
    educations: 'EDUCATION',
    projects: 'PROJECT',
    skills: 'SKILLS',
    custom: 'CUSTOM SECTION',
  },
  formsOrder: ['workExperiences', 'educations', 'projects', 'skills', 'custom'],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};

/**
 * Redux Slice handling application-level UI preferences and settings.
 * Uses Redux Toolkit's 'immer' for safe mutations.
 */
export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettings,
  reducers: {
    changeSettings: (draft, action: PayloadAction<{ field: GeneralSetting; value: string }>) => {
      const { field, value } = action.payload;
      draft[field] = value;
    },
    changeShowForm: (draft, action: PayloadAction<{ field: ShowForm; value: boolean }>) => {
      const { field, value } = action.payload;
      draft.formToShow[field] = value;
    },
    changeFormHeading: (draft, action: PayloadAction<{ field: ShowForm; value: string }>) => {
      const { field, value } = action.payload;
      draft.formToHeading[field] = value;
    },
    changeFormOrder: (draft, action: PayloadAction<{ form: ShowForm; type: 'up' | 'down' }>) => {
      const { form, type } = action.payload;
      const lastIdx = draft.formsOrder.length - 1;
      const pos = draft.formsOrder.indexOf(form);
      const newPos = type === 'up' ? pos - 1 : pos + 1;
      const swapFormOrder = (idx1: number, idx2: number) => {
        const temp = draft.formsOrder[idx1];
        draft.formsOrder[idx1] = draft.formsOrder[idx2];
        draft.formsOrder[idx2] = temp;
      };
      if (newPos >= 0 && newPos <= lastIdx) {
        swapFormOrder(pos, newPos);
      }
    },
    changeShowBulletPoints: (
      draft,
      action: PayloadAction<{
        field: FormWithBulletPoints;
        value: boolean;
      }>
    ) => {
      const { field, value } = action.payload;
      draft['showBulletPoints'][field] = value;
    },
    setSettings: (draft, action: PayloadAction<Settings>) => {
      return action.payload;
    },
    changeTemplate: (draft, action: PayloadAction<Settings['templateId']>) => {
      draft.templateId = action.payload;
    },
    changeDesign: (
      draft,
      action: PayloadAction<{ field: keyof Settings['design']; value: string }>
    ) => {
      const { field, value } = action.payload;
      draft.design[field] = value;
      if (field === 'highlight') {
        draft.themeColor = value; // Keep themeColor in sync
      }
    },
    addCustomSection: (draft, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      draft.formToShow[id] = true;
      draft.formToHeading[id] = 'CUSTOM SECTION';
      draft.showBulletPoints[id] = true;
      draft.formsOrder.push(id);
    },
    removeCustomSection: (draft, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      delete draft.formToShow[id];
      delete draft.formToHeading[id];
      delete draft.showBulletPoints[id];
      draft.formsOrder = draft.formsOrder.filter((form) => form !== id);
    },
  },
});

export const {
  changeSettings,
  changeShowForm,
  changeFormHeading,
  changeFormOrder,
  changeShowBulletPoints,
  setSettings,
  changeTemplate,
  changeDesign,
  addCustomSection,
  removeCustomSection,
} = settingsSlice.actions;

// Standard State Selectors
export const selectSettings = (state: RootState) => state.settings;
export const selectThemeColor = (state: RootState) => state.settings.themeColor;

export const selectFormToShow = (state: RootState) => state.settings.formToShow;
export const selectShowByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToShow[form];

export const selectFormToHeading = (state: RootState) => state.settings.formToHeading;
export const selectHeadingByForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formToHeading[form];

export const selectFormsOrder = (state: RootState) => state.settings.formsOrder;
export const selectIsFirstForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[0] === form;
export const selectIsLastForm = (form: ShowForm) => (state: RootState) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

export const selectShowBulletPoints = (form: FormWithBulletPoints) => (state: RootState) =>
  state.settings.showBulletPoints[form];

export default settingsSlice.reducer;
