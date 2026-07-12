import { Form } from 'components/ResumeForm/Form';
import { BulletListIconButton } from 'components/ResumeForm/Form/IconButton';
import { BulletListTextarea } from 'components/ResumeForm/Form/InputGroup';
import { useAppDispatch, useAppSelector } from 'lib/redux/hooks';
import { changeCustom } from 'lib/redux/resumeSlice';
import {
  selectShowBulletPoints,
  changeShowBulletPoints,
  removeCustomSection,
} from 'lib/redux/settingsSlice';
import type { RootState } from 'lib/redux/store';

/**
 * CustomForm component allows users to dynamically add arbitrary sections
 * (like "Awards", "Certifications", "Languages") to their resume.
 *
 * It reads from either the default 'custom' object or a dynamically generated
 * ID in `customSections`.
 */
export const CustomForm = ({ form = 'custom' }: { form?: string }) => {
  const custom = useAppSelector((state: RootState) =>
    form === 'custom' ? state.resume.custom : state.resume.customSections?.[form]
  ) || { descriptions: [] };
  const dispatch = useAppDispatch();
  const { descriptions } = custom;
  const showBulletPoints = useAppSelector(selectShowBulletPoints(form));

  const handleCustomChange = (field: 'descriptions', value: string[]) => {
    dispatch(changeCustom({ field, value, id: form }));
  };

  const handleShowBulletPoints = (value: boolean) => {
    dispatch(changeShowBulletPoints({ field: form, value }));
  };

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        {form !== 'custom' && (
          <div className="col-span-full flex justify-end">
            <button
              type="button"
              onClick={() => {
                dispatch(removeCustomSection({ id: form }));
                import('lib/redux/resumeSlice').then(({ deleteDynamicCustomSection }) => {
                  dispatch(deleteDynamicCustomSection({ id: form }));
                });
              }}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Delete Section
            </button>
          </div>
        )}
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Bullet points"
            value={descriptions}
            onChange={handleCustomChange}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={handleShowBulletPoints}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
