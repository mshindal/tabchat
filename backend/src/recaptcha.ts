import fetch from "node-fetch";
import { URL } from "url";
import configuration from "./configuration";

// https://developers.google.com/recaptcha/docs/v3#site-verify-response
interface SiteVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes': number[];
}

// https://developers.google.com/recaptcha/docs/verify
export const verifyToken = async (token: string) => {
  const url = new URL('https://www.google.com/recaptcha/api/siteverify');
  url.searchParams.append('secret', configuration.recaptchaSecret);
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
