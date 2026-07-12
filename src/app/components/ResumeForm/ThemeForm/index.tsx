import { BaseForm } from 'components/ResumeForm/Form';
import { InputGroupWrapper } from 'components/ResumeForm/Form/InputGroup';
import { THEME_COLORS } from 'components/ResumeForm/ThemeForm/constants';
import { InlineInput } from 'components/ResumeForm/ThemeForm/InlineInput';
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from 'components/ResumeForm/ThemeForm/Selection';
import {
  changeSettings,
  changeTemplate,
  changeDesign,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from 'lib/redux/settingsSlice';
import { useAppDispatch, useAppSelector } from 'lib/redux/hooks';
import { type FontFamily, FONT_FAMILY_TO_DISPLAY_NAME } from 'components/fonts/constants';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize, templateId, design } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  const handleDesignChange = (field: keyof typeof design, value: string) => {
    dispatch(changeDesign({ field, value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="text-theme-text-muted h-6 w-6" aria-hidden="true" />
          <h1 className="text-theme-text-main text-lg font-semibold tracking-wide">
            Resume Setting
          </h1>
        </div>

        <div>
          <InputGroupWrapper label="Template" />
          <select
            value={templateId}
            onChange={(e) => dispatch(changeTemplate(e.target.value as any))}
            className="border-theme-base bg-theme-base text-theme-text-main mt-2 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="base">Base</option>
            <option value="tech">Tech (ATS Friendly)</option>
          </select>
        </div>

        <div>
          <InputGroupWrapper label="Theme Colors" />
          <div className="mb-4 mt-2 flex flex-wrap gap-2">
            {THEME_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleDesignChange('highlight', color)}
                className="border-theme-base h-8 w-8 rounded-full border transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                style={{ backgroundColor: color }}
                aria-label={`Select theme color ${color}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-theme-text-muted mb-1 block text-xs">Highlight</label>
              <input
                type="color"
                value={design?.highlight || themeColor}
                onChange={(e) => handleDesignChange('highlight', e.target.value)}
                className="border-theme-base h-8 w-full cursor-pointer rounded border"
              />
            </div>
            <div>
              <label className="text-theme-text-muted mb-1 block text-xs">Text</label>
              <input
                type="color"
                value={design?.text || '#000000'}
                onChange={(e) => handleDesignChange('text', e.target.value)}
                className="border-theme-base h-8 w-full cursor-pointer rounded border"
              />
            </div>
            <div>
              <label className="text-theme-text-muted mb-1 block text-xs">Background</label>
              <input
                type="color"
                value={design?.background || '#ffffff'}
                onChange={(e) => handleDesignChange('background', e.target.value)}
                className="border-theme-base h-8 w-full cursor-pointer rounded border"
              />
            </div>
            <div>
              <label className="text-theme-text-muted mb-1 block text-xs">Surface (Sidebar)</label>
              <input
                type="color"
                value={design?.surface || '#f8fafc'}
                onChange={(e) => handleDesignChange('surface', e.target.value)}
                className="border-theme-base h-8 w-full cursor-pointer rounded border"
              />
            </div>
          </div>
        </div>

        <div>
          <InputGroupWrapper label="Font Family" />
          <select
            value={fontFamily}
            onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
            className="border-theme-base bg-theme-base text-theme-text-main mt-2 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="Roboto">Roboto</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
            <option value="OpenSans">Open Sans</option>
            <option value="Helvetica">Helvetica (Standard)</option>
            <option value="Times-Roman">Times Roman (Standard)</option>
            <option value="Courier">Courier (Standard)</option>
          </select>
        </div>
        <div>
          <InlineInput
            label="Font Size (pt)"
            name="fontSize"
            value={fontSize}
            placeholder="11"
            onChange={handleSettingsChange}
          />
          <FontSizeSelections
            fontFamily={fontFamily as FontFamily}
            themeColor={themeColor}
            selectedFontSize={fontSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InputGroupWrapper label="Document Size" />
          <DocumentSizeSelections
            themeColor={themeColor}
            selectedDocumentSize={documentSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
      </div>
    </BaseForm>
  );
};
