import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ResumeStateService } from './resume-state.service';
import { ResumeData } from '../models/resume.model';
import { firstValueFrom, skip } from 'rxjs';

// Mock localStorage for Vitest environment
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ResumeStateService', () => {
  let service: ResumeStateService;

  const MOCK_SAVED_STATE: ResumeData = {
    personalInfo: {
      name: 'Jane Doe',
      title: 'Software Engineer',
      email: 'jane.doe@example.com',
      phone: '987-654-3210',
      location: 'San Francisco, CA',
      customLinks: [],
    },
    summary: '<p>Experienced developer.</p>',
    sections: [],
    design: {
      text: '#1F2937',
      background: '#FFFFFF',
      highlight: '#4F46E5',
      surface: '#EEF2FF',
      font: 'font-sans',
    },
  };

  const MOCK_UPDATED_STATE: ResumeData = {
    personalInfo: {
      name: 'Jane Doe Updated',
      title: 'Senior Software Engineer',
      email: 'jane.doe.updated@example.com',
      phone: '987-654-3211',
      location: 'San Francisco, CA',
      customLinks: [],
    },
    summary: '<p>Updated experienced developer.</p>',
    sections: [],
    design: {
      text: '#1F2937',
      background: '#FFFFFF',
      highlight: '#4F46E5',
      surface: '#EEF2FF',
      font: 'font-sans',
    },
  };

  beforeEach(() => {
    // Completely reset mocks before each test
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    // Notice: We are NOT instantiating the service here anymore!
  });

  afterEach(() => {
    // Ensure real timers are restored after any test using fake timers
    vi.useRealTimers();
  });

  it('should be created', () => {
    service = new ResumeStateService();
    expect(service).toBeTruthy();
  });

  it('should hydrate from localStorage if data exists', async () => {
    // 1. Setup the environment FIRST
    localStorageMock.setItem('savedResume', JSON.stringify(MOCK_SAVED_STATE));

    // 2. Instantiate the service SECOND (so it reads the mock data on init)
    service = new ResumeStateService();

    const data = await firstValueFrom(service.resumeData$);
    expect(data).toEqual(MOCK_SAVED_STATE);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('savedResume');
  });

  it('should provide default state if localStorage is empty or invalid', async () => {
    localStorageMock.getItem.mockReturnValueOnce(null);

    service = new ResumeStateService();

    const data = await firstValueFrom(service.resumeData$);
    expect(data.personalInfo.name).toBe('John Doe'); // Default name fallback
    expect(localStorageMock.getItem).toHaveBeenCalledWith('savedResume');
  });

  it('should provide default state if localStorage data is unparseable', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorageMock.setItem('savedResume', 'invalid json string');

    service = new ResumeStateService();

    const data = await firstValueFrom(service.resumeData$);
    expect(data.personalInfo.name).toBe('John Doe');
    consoleSpy.mockRestore();
  });

  it('should update state and emit new data', async () => {
    service = new ResumeStateService();
    const dataPromise = firstValueFrom(service.resumeData$.pipe(skip(1)));

    service.updateResumeState(MOCK_UPDATED_STATE);

    const data = await dataPromise;
    expect(data).toEqual(MOCK_UPDATED_STATE);
  });

  it('should debounce saving to localStorage by 1000ms', async () => {
    // 1. Enable fake timers BEFORE RxJS subscriptions are created
    vi.useFakeTimers();

    // 2. Instantiate service
    service = new ResumeStateService();

    service.updateResumeState(MOCK_UPDATED_STATE);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();

    service.updateResumeState(MOCK_SAVED_STATE);
    vi.advanceTimersByTime(500);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'savedResume',
      JSON.stringify(MOCK_SAVED_STATE),
    );
  });

  it('should not save initial default state to localStorage immediately', async () => {
    vi.useFakeTimers();
    service = new ResumeStateService();

    // Allow the 1000ms debounce to pass
    vi.advanceTimersByTime(1500);

    // Check that it wasn't saved (because filter logic prevented it)
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('getCurrentResumeData should return the current state snapshot', () => {
    service = new ResumeStateService();
    service.updateResumeState(MOCK_UPDATED_STATE);

    const currentState = service.getCurrentResumeData();
    expect(currentState).toEqual(MOCK_UPDATED_STATE);
  });
});
