import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, filter, tap } from 'rxjs';
import { ResumeData, SectionType } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeStateService {
  private readonly localStorageKey = 'savedResume';
  private _resumeData = new BehaviorSubject<ResumeData>(this.getInitialState());
  public readonly resumeData$: Observable<ResumeData> = this._resumeData.asObservable();

  constructor() {
    this._resumeData
      .pipe(
        // Use a simple JSON stringify check for content equality
        filter((data) => JSON.stringify(data) !== JSON.stringify(this.getDefaultResumeData())),
        debounceTime(1000),
        tap((data) => this.saveState(data)),
      )
      .subscribe();
  }

  private getInitialState(): ResumeData {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem(this.localStorageKey);
      if (savedState) {
        try {
          const parsedState: ResumeData = JSON.parse(savedState);
          // Basic validation to ensure the parsed state is not completely malformed
          if (parsedState && parsedState.personalInfo && parsedState.sections) {
            // Migration for older designs
            if (parsedState.design && 'color' in parsedState.design && !parsedState.design.text) {
              const c = (parsedState.design as { color?: string }).color;
              parsedState.design = {
                text: '#1F2937',
                background: '#FFFFFF',
                highlight: c || '#3B82F6',
                surface: '#F3F4F6',
                font: parsedState.design.font || 'font-sans',
              };
            }
            // Add default design if missing entirely
            if (!parsedState.design) {
              parsedState.design = this.getDefaultResumeData().design!;
            }
            return parsedState;
          }
        } catch (e) {
          console.error('Error parsing saved resume data from localStorage:', e);
          // Fallback to default if parsing fails
        }
      }
    }
    return this.getDefaultResumeData();
  }

  private getDefaultResumeData(): ResumeData {
    return {
      templateId: 'base',
      design: {
        text: '#1F2937', // text-gray-800
        background: '#FFFFFF', // white
        highlight: '#4F46E5', // indigo-600
        surface: '#EEF2FF', // indigo-50
        font: 'font-sans',
        documentSize: 'a4',
        margins: 'standard',
      },
      personalInfo: {
        name: 'John Doe',
        title: 'Senior Project Manager',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: 'New York, NY',
        customLinks: [
          { label: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
          { label: 'Portfolio', url: 'https://johndoe-portfolio.com' },
        ],
      },
      summary:
        '<p>A highly motivated and results-driven professional with extensive experience in leading complex projects and teams across various industries. Proven ability to drive strategic initiatives and deliver exceptional outcomes.</p>',
      sections: [
        {
          id: 'experience-1',
          title: 'Professional Experience',
          type: 'timeline' as SectionType, // Explicitly cast for type safety
          items: [
            {
              headline: 'Project Lead',
              subheading: 'Tech Solutions Inc.',
              date: 'Jan 2020 - Present',
              description:
                'Led cross-functional teams in developing enterprise software solutions. Managed project lifecycles from conception to deployment.',
            },
            {
              headline: 'Operations Manager',
              subheading: 'Global Logistics Co.',
              date: 'Mar 2015 - Dec 2019',
              description:
                'Optimized supply chain processes, resulting in a 15% reduction in operational costs. Managed a team of 20+ employees.',
            },
          ],
        },
        {
          id: 'skills-1',
          title: 'Key Skills',
          type: 'skills-grid' as SectionType,
          skillTags: [
            { name: 'Project Management', level: 'expert' },
            { name: 'Strategic Planning', level: 'advanced' },
            { name: 'Team Leadership', level: 'expert' },
            { name: 'Budget Management', level: 'advanced' },
            { name: 'Process Improvement', level: 'advanced' },
          ],
        },
        {
          id: 'about-me',
          title: 'About Me',
          type: 'custom-rich-text' as SectionType,
          customHtmlContent:
            '<p>Passionate about fostering innovation and continuous improvement. I enjoy mentoring junior team members and contributing to a positive work environment.</p>',
        },
      ],
    };
  }

  private saveState(data: ResumeData): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
      } catch (e) {
        console.error('Error saving resume data to localStorage:', e);
      }
    }
  }

  /**
   * Updates the entire resume state.
   * @param newData The new ResumeData object to set.
   */
  public updateResumeState(newData: ResumeData): void {
    this._resumeData.next(newData);
  }

  /**
   * Returns the current resume data snapshot.
   * Useful for synchronous access when an observable subscription is not needed.
   */
  public getCurrentResumeData(): ResumeData {
    return this._resumeData.getValue();
  }
}
