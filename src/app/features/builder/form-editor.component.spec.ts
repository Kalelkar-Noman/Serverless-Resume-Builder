import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormEditorComponent } from './form-editor.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ResumeStateService } from '../../core/services/resume-state.service';
import { BehaviorSubject } from 'rxjs';
import { ResumeData, SectionType } from '../../core/models/resume.model';
import { CommonModule } from '@angular/common';

const mockResumeData: ResumeData = {
  personalInfo: {
    name: 'Test User',
    title: 'Tester',
    email: 'test@example.com',
    phone: '111-222-3333',
    location: 'Test City',
    customLinks: [{ label: 'GitHub', url: 'https://github.com/test' }],
  },
  summary: '<p>Test summary</p>',
  sections: [
    {
      id: 'timeline-1',
      title: 'Experience',
      type: 'timeline' as SectionType,
      items: [
        { headline: 'Job 1', subheading: 'Company A', date: '2020-2021', description: 'Desc A' },
      ],
    },
    {
      id: 'skills-1',
      title: 'Skills',
      type: 'skills-grid' as SectionType,
      skillTags: [{ name: 'Angular', level: 'advanced' }],
    },
  ],
};

class MockResumeStateService {
  private _resumeData = new BehaviorSubject<ResumeData>(mockResumeData);
  public resumeData$ = this._resumeData.asObservable();

  updateResumeState = vi.fn((data: ResumeData) => {
    this._resumeData.next(data);
  });
  getCurrentResumeData = vi.fn(() => this._resumeData.getValue());
}

describe('FormEditorComponent', () => {
  let component: FormEditorComponent;
  let fixture: ComponentFixture<FormEditorComponent>;
  let resumeStateService: MockResumeStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, QuillModule.forRoot(), FormEditorComponent],
      providers: [FormBuilder, { provide: ResumeStateService, useClass: MockResumeStateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEditorComponent);
    component = fixture.componentInstance;
    resumeStateService = TestBed.inject(ResumeStateService) as unknown as MockResumeStateService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data from ResumeStateService', () => {
    expect(component.resumeForm.get('personalInfo.name')?.value).toBe(
      mockResumeData.personalInfo.name,
    );
    expect(component.resumeForm.get('summary')?.value).toBe(mockResumeData.summary);
    expect(component.sections.length).toBe(mockResumeData.sections.length);
    expect(component.getSectionItems(0).length).toBe(1);
  });

  it('should update ResumeStateService on form value changes', () => {
    const newName = 'Updated Name';
    component.resumeForm.get('personalInfo.name')?.setValue(newName);

    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should add a new section block to the form array', () => {
    const initialSectionCount = component.sections.length;
    component.addSection();
    expect(component.sections.length).toBe(initialSectionCount + 1);

    const newSection = component.sections.at(initialSectionCount) as FormGroup;
    expect(newSection.get('title')?.value).toBe('New Timeline Section');
    expect(newSection.get('type')?.value).toBe('timeline');
  });

  it('should remove a section block from the form array', () => {
    const initialSectionCount = component.sections.length;
    component.removeSection(0);
    expect(component.sections.length).toBe(initialSectionCount - 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should add a new custom link', () => {
    const initialLinkCount = component.customLinks.length;
    component.addCustomLink();
    expect(component.customLinks.length).toBe(initialLinkCount + 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should remove a custom link', () => {
    const initialLinkCount = component.customLinks.length;
    component.removeCustomLink(0);
    expect(component.customLinks.length).toBe(initialLinkCount - 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should correctly handle section type change from timeline to skills-grid', () => {
    component.addSection();
    const newSectionIndex = component.sections.length - 1;

    // Set value without emitting event to safely test the pure component method
    component.sections
      .at(newSectionIndex)
      .get('type')
      ?.setValue('skills-grid', { emitEvent: false });
    component.onSectionTypeChange(newSectionIndex);

    const updatedSectionGroup = component.sections.at(newSectionIndex) as FormGroup;
    expect(updatedSectionGroup.get('type')?.value).toBe('skills-grid');
    expect(updatedSectionGroup.get('items')?.enabled).toBe(false);
    expect(updatedSectionGroup.get('skillTags')?.enabled).toBe(true);
  });

  it('should correctly handle section type change from timeline to custom-rich-text', () => {
    component.addSection();
    const newSectionIndex = component.sections.length - 1;

    component.sections
      .at(newSectionIndex)
      .get('type')
      ?.setValue('custom-rich-text', { emitEvent: false });
    component.onSectionTypeChange(newSectionIndex);

    const updatedSectionGroup = component.sections.at(newSectionIndex) as FormGroup;
    expect(updatedSectionGroup.get('type')?.value).toBe('custom-rich-text');
    expect(updatedSectionGroup.get('items')?.enabled).toBe(false);
    expect(updatedSectionGroup.get('customHtmlContent')?.enabled).toBe(true);
  });

  it('should add a new timeline item to a timeline section', () => {
    const timelineSectionIndex = component.sections.controls.findIndex(
      (s) => s.get('type')?.value === 'timeline',
    );
    expect(timelineSectionIndex).not.toBe(-1);

    const initialItemCount = component.getSectionItems(timelineSectionIndex).length;
    component.addTimelineItem(timelineSectionIndex);
    expect(component.getSectionItems(timelineSectionIndex).length).toBe(initialItemCount + 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should remove a timeline item from a timeline section', () => {
    const timelineSectionIndex = component.sections.controls.findIndex(
      (s) => s.get('type')?.value === 'timeline',
    );
    expect(timelineSectionIndex).not.toBe(-1);

    const initialItemCount = component.getSectionItems(timelineSectionIndex).length;
    component.removeTimelineItem(timelineSectionIndex, 0);
    expect(component.getSectionItems(timelineSectionIndex).length).toBe(initialItemCount - 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should add a new skill item to a skills-grid section', () => {
    const skillsGridSectionIndex = component.sections.controls.findIndex(
      (s) => s.get('type')?.value === 'skills-grid',
    );
    expect(skillsGridSectionIndex).not.toBe(-1);

    const initialSkillCount = component.getSectionSkills(skillsGridSectionIndex).length;
    component.addSkillItem(skillsGridSectionIndex);
    expect(component.getSectionSkills(skillsGridSectionIndex).length).toBe(initialSkillCount + 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });

  it('should remove a skill item from a skills-grid section', () => {
    const skillsGridSectionIndex = component.sections.controls.findIndex(
      (s) => s.get('type')?.value === 'skills-grid',
    );
    expect(skillsGridSectionIndex).not.toBe(-1);

    const initialSkillCount = component.getSectionSkills(skillsGridSectionIndex).length;
    component.removeSkillItem(skillsGridSectionIndex, 0);
    expect(component.getSectionSkills(skillsGridSectionIndex).length).toBe(initialSkillCount - 1);
    expect(resumeStateService.updateResumeState).toHaveBeenCalled();
  });
});
