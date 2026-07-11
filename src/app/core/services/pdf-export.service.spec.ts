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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve immediately if resume-document is not found', async () => {
    await expect(service.downloadPdf()).resolves.toBeUndefined();
  });

  it('should open a print window and trigger print', async () => {
    // Create a dummy resume-document element
    const dummyElement = document.createElement('div');
    dummyElement.id = 'resume-document';
    dummyElement.innerHTML = '<div class="resume-template">Test</div>';
    document.body.appendChild(dummyElement);

    // Mock window.open to return a mock print window
    const mockPrintDoc = {
      open: vi.fn(),
      write: vi.fn(),
      close: vi.fn(),
      fonts: {
        ready: Promise.resolve(),
      },
      querySelectorAll: vi.fn(() => []),
    };
    const mockPrintWindow = {
      document: mockPrintDoc,
      focus: vi.fn(),
      print: vi.fn(),
      close: vi.fn(),
    };
    vi.spyOn(window, 'open').mockReturnValue(mockPrintWindow as unknown as Window);

    await service.downloadPdf();

    expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=900,height=700');
    expect(mockPrintDoc.write).toHaveBeenCalled();
    expect(mockPrintWindow.print).toHaveBeenCalled();

    // Verify the loading state was properly reset
    expect(service.isGenerating).toBe(false);

    // Clean up
    if (document.body.contains(dummyElement)) {
      document.body.removeChild(dummyElement);
    }
  });

  it('should handle popup blocker by throwing an error', async () => {
    const dummyElement = document.createElement('div');
    dummyElement.id = 'resume-document';
    document.body.appendChild(dummyElement);

    // Mock window.open to return null (popup blocked)
    vi.spyOn(window, 'open').mockReturnValue(null);

    await expect(service.downloadPdf()).rejects.toThrow('Could not open print window');

    // Verify loading state was reset even after error
    expect(service.isGenerating).toBe(false);

    if (document.body.contains(dummyElement)) {
      document.body.removeChild(dummyElement);
    }
  });
});
