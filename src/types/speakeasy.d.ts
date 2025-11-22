declare module 'speakeasy' {
  export interface Secret {
    ascii: string;
    hex: string;
    base32: string;
    otpauth_url?: string;
  }

  export interface GenerateSecretOptions {
    name?: string;
    issuer?: string;
    length?: number;
  }

  export function generateSecret(options?: GenerateSecretOptions): Secret;

  export interface TotpVerifyOptions {
    secret: string;
    encoding: 'base32' | 'hex' | 'ascii';
    token: string;
    window?: number;
  }

  export const totp: {
    verify(options: TotpVerifyOptions): boolean;
  };
}

