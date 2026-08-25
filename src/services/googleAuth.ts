import { GoogleAuthUser, UserRole } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: string | number;
              locale?: string;
            }
          ) => void;
          prompt: (notification?: (notification: unknown) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

export interface ParsedGoogleToken {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  iat?: number;
  exp?: number;
}

const STORAGE_KEY = 'resolva_ja_google_auth_v1';

/**
 * Safely parse a base64url-encoded JWT token without external libraries
 */
export function parseJwt(token: string): ParsedGoogleToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Failed to parse Google JWT payload:', err);
    return null;
  }
}

/**
 * Load saved Google Auth session from localStorage
 */
export function getSavedGoogleUser(): GoogleAuthUser | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Persist Google Auth user to localStorage
 */
export function saveGoogleUser(user: GoogleAuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.warn('Failed to save user session:', e);
  }
}

/**
 * Create a Google user object from a decoded JWT payload
 */
export function createGoogleUserFromPayload(
  payload: ParsedGoogleToken,
  role: UserRole,
  rawToken?: string
): GoogleAuthUser {
  return {
    id: payload.sub || `google-${Date.now()}`,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    givenName: payload.given_name,
    familyName: payload.family_name,
    picture:
      payload.picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        payload.name || 'User'
      )}&background=ea580c&color=ffffff&bold=true`,
    verifiedEmail: payload.email_verified ?? true,
    role,
    authProvider: 'google',
    connectedAt: new Date().toISOString(),
    token: rawToken
  };
}

/**
 * Quick Google Demo / Simulation Accounts for immediate testing & iframe sandbox environments
 */
export const DEMO_GOOGLE_ACCOUNTS: Array<{
  name: string;
  email: string;
  picture: string;
  role: UserRole;
  description: string;
}> = [
  {
    name: 'Natália Andrade',
    email: 'andradenaty23@gmail.com',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'cliente',
    description: 'Cliente Residencial • São Paulo - SP'
  },
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes.engenharia@gmail.com',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'cliente',
    description: 'Cliente Residencial • Apartamento Jardins'
  },
  {
    name: 'Ricardo Silva',
    email: 'ricardo.silva.pro@gmail.com',
    picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    role: 'prestador',
    description: 'Prestador PRO • Hidráulica & Desentupimento (Nota 4.9)'
  },
  {
    name: 'Marcos Oliveira',
    email: 'marcos.oliveira.eletrica@gmail.com',
    picture: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    role: 'prestador',
    description: 'Prestador PRO • Eletricista Certificado NR-10'
  }
];
