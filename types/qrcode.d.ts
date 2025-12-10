declare module 'qrcode' {
  export interface ToDataURLOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toDataURL(
    text: string,
    options?: ToDataURLOptions
  ): Promise<string>;
}