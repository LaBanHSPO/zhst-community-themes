/// <reference types="astro/client" />
/// <reference types="emdash/locals" />

declare module 'virtual:erp-mini/accounting-settings' {
  const settings: Readonly<{
    version: 1;
    currency: 'USD' | 'EUR' | 'GBP' | 'VND' | 'JPY';
    /** Present only in captured Node settings; Workers have no filesystem target. */
    dataDirectory?: string;
    origin: string;
  }>;
  export default settings;
}
