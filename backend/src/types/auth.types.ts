// types/auth.types.ts
import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

// Create a custom profile interface instead of extending the conflicting ones
export interface SocialProfile {
  provider: string;
  id: string;
  displayName?: string;
  emails?: Array<{
    value: string;
    verified?: boolean;
  }>;
  photos?: Array<{
    value: string;
  }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  _json?: any;
}

// Add specific type guards
export function isFacebookProfile(profile: any): profile is FacebookProfile {
  return profile && profile.provider === 'facebook';
}

export function isGoogleProfile(profile: any): profile is GoogleProfile {
  return profile && profile.provider === 'google';
}

// Add specific authentication options types
export interface FacebookAuthOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  profileFields: string[];
  scope: string[];
  authType?: string;
  prompt?: string;
}