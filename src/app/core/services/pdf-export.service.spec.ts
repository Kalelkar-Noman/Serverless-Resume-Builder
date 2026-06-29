import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PdfExportService } from './pdf-export.service';
import { TestBed } from '@angular/core/testing';

describe('PdfExportService', () => {
  let service: PdfExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfExportService],
    });
    service = TestBed.inject(PdfExportService);
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve immediately if resume-document is not found', async () => {
    await expect(service.downloadPdf()).resolves.toBeUndefined();
  });

  it('should create an iframe, write to it, and trigger print', async () => {
    const dummyElement = document.createElement('div');
    dummyElement.id = 'resume-document';
    document.body.appendChild(dummyElement);

    const originalCreateElement = document.createElement.bind(document);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockIframe: any;

    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'iframe') {
        mockIframe = originalCreateElement('iframe');
        Object.defineProperty(mockIframe, 'contentWindow', {
          value: {
            document: {
              open: vi.fn(),
              write: vi.fn(),
              close: vi.fn(),
            },
            focus: vi.fn(),
            print: vi.fn(),
          },
          writable: true,
        });
        return mockIframe;
      }
      return originalCreateElement(tagName);
    });

    const promise = service.downloadPdf();

    // Fast-forward timers
    vi.advanceTimersByTime(1500);

    expect(mockIframe.contentWindow.document.write).toHaveBeenCalled();
    expect(mockIframe.contentWindow.print).toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    await promise;

    if (document.body.contains(dummyElement)) {
      document.body.removeChild(dummyElement);
    }
  });
});
