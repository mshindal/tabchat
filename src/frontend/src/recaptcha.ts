// This comes from recaptcha's api.js
declare var grecaptcha: any;
// These come from the WebpackDefinePlugin
declare var RECAPTCHA_SITEKEY: string | undefined;
declare var USE_RECAPTCHA: boolean;

export const useRecaptcha = USE_RECAPTCHA;

let isReady = false;

if (useRecaptcha) {
  grecaptcha.ready(() => isReady = true);
} else {
  console.warn('USE_RECAPTCHA is set to false, disabling reCAPTCHA');
}

export const getToken = async () => {
  if (!isReady) {
    throw new Error('reCAPTCHA isn\'t ready yet. Try again in a few seconds');
  }
  return await grecaptcha.execute(RECAPTCHA_SITEKEY) as string;
}
