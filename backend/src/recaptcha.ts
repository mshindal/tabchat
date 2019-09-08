import fetch from "node-fetch";
import { URL } from "url";

// https://developers.google.com/recaptcha/docs/v3#site-verify-response
interface SiteVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes': number[];
}

// Should we use reCAPTCHA at all?
export const useRecaptcha = process.env['USE_RECAPTCHA'] !== undefined;

useRecaptcha ? 
  console.log('The environment variable USE_RECAPTCHA is set - reCAPTCHA is enabled') : 
  console.log(`The environment variable USE_RECAPTCHA is unset - reCAPTCHA is disabled`);

const secret = process.env['RECAPTCHA_SECRET']

if (useRecaptcha && !secret) {
  throw new Error(`The environment variable USE_RECAPTCHA is set, but RECAPTCHA_SECRET is missing. 
    If you want to disable reCAPTCHA, unset the USE_RECAPTCHA environment variable.
    Otherwise, set RECAPTCHA_SECRET.`);
}

// https://developers.google.com/recaptcha/docs/verify
export const verifyToken = async (token: string) => {
  const url = new URL('https://www.google.com/recaptcha/api/siteverify');
  url.searchParams.append('secret', secret);
  url.searchParams.append('response', token);
  const response = await fetch(url.href, {
    method: 'POST',
  });
  const json: SiteVerifyResponse = await response.json();
  if (!json.success || json.score < .5) {
    return false;
  }
  return true;
}
