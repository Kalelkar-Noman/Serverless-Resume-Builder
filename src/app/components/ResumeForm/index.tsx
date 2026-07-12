'use client';
import { useState } from 'react';
import {
  useAppSelector,
  useAppDispatch,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from 'lib/redux/hooks';
import { ShowForm, selectFormsOrder } from 'lib/redux/settingsSlice';
import { ProfileForm } from 'components/ResumeForm/ProfileForm';
import { WorkExperiencesForm } from 'components/ResumeForm/WorkExperiencesForm';
import { EducationsForm } from 'components/ResumeForm/EducationsForm';
import { ProjectsForm } from 'components/ResumeForm/ProjectsForm';
import { SkillsForm } from 'components/ResumeForm/SkillsForm';
import { ThemeForm } from 'components/ResumeForm/ThemeForm';
import { CustomForm } from 'components/ResumeForm/CustomForm';
import { FlexboxSpacer } from 'components/FlexboxSpacer';
import { cx } from 'lib/cx';

const formTypeToComponent: Record<string, React.FC<any>> = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

/**
 * ResumeForm is the main container for the left-side editing panel.
 * It initializes the Redux store from local storage, starts the autosave listener,
 * and dynamically renders the individual section forms based on the `formsOrder` state.
 */
export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const dispatch = useAppDispatch();
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cx(
        'scrollbar-track-theme-base flex justify-center scrollbar-thin md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll',
        isHover ? 'scrollbar-thumb-theme-text-muted' : 'scrollbar-thumb-theme-card'
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <ThemeForm />
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = form.startsWith('custom') ? CustomForm : formTypeToComponent[form];
          return <Component key={form} form={form} />;
        })}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const newId = `custom-${Date.now()}`;
              import('lib/redux/settingsSlice').then(({ addCustomSection }) => {
                dispatch(addCustomSection({ id: newId }));
              });
              import('lib/redux/resumeSlice').then(({ addDynamicCustomSection }) => {
                dispatch(addDynamicCustomSection({ id: newId }));
              });
            }}
            className="bg-theme-card text-theme-text-main ring-theme-base rounded-md px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset hover:opacity-80"
          >
            + Add Custom Section
          </button>
        </div>
        <br />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
