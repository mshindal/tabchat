import fetch from "node-fetch";

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
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
    method: 'POST',
  });
  const json = await response.json();
  return json.success;
}
