/// <reference types="vite/client" />

declare global {
  interface Window {
    pdfjsLib?: {
      getDocument: (opts: { data: ArrayBuffer; disableWorker?: boolean }) => {
        promise: Promise<{
          numPages: number;
          getPage: (n: number) => Promise<unknown>;
        }>;
      };
    };
  }
}

export {};
