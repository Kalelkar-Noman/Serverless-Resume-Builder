'use client';
import { memo, useEffect } from 'react';
import { useSetDefaultScale } from 'components/Resume/hooks';
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { usePDF } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';

/**
 * ResumeControlBar allows the user to zoom in/out and download the PDF.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent state changes.
 */
const ResumeControlBar = memo(
  ({
    scale,
    setScale,
    documentSize,
    document,
    fileName,
  }: {
    scale: number;
    setScale: (scale: number) => void;
    documentSize: string;
    document: JSX.Element;
    fileName: string;
  }) => {
    const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
      setScale,
      documentSize,
    });

    const [instance, update] = usePDF({ document });

    // Hook to update pdf when document changes
    useEffect(() => {
      update();
    }, [update, document]);

    return (
      <div className="text-theme-text-muted bg-theme-card border-theme-base sticky left-0 right-0 top-0 z-10 flex h-[var(--resume-control-bar-height)] items-center justify-center border-b px-[var(--resume-padding)] lg:justify-between">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.01}
            value={scale}
            onChange={(e) => {
              setScaleOnResize(false);
              setScale(Number(e.target.value));
            }}
          />
          <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
          <label className="hidden items-center gap-1 lg:flex">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={scaleOnResize}
              onChange={() => setScaleOnResize((prev) => !prev)}
            />
            <span className="select-none">Autoscale</span>
          </label>
        </div>
        <a
          className="border-theme-base hover:bg-theme-base hover:text-theme-text-main ml-1 flex items-center gap-1 rounded-md border px-3 py-0.5 lg:ml-8"
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Resume</span>
        </a>
      </div>
    );
  }
);
ResumeControlBar.displayName = 'ResumeControlBar';

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(() => Promise.resolve(ResumeControlBar), {
  ssr: false,
});

export const ResumeControlBarBorder = () => (
  <div className="bg-theme-base absolute top-[var(--resume-control-bar-height)] w-full border-b-2" />
);
