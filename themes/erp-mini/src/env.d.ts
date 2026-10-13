/// <reference types="astro/client" />
/// <reference types="emdash/locals" />

declare module 'virtual:erp-mini/accounting-settings' {
  const settings: Readonly<{
    version: 1;
    currency: 'USD' | 'EUR' | 'GBP' | 'VND' | 'JPY';
    dataDirectory: string;
    origin: string;
  }>;
  export default settings;
}
