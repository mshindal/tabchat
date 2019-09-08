// This comes from recaptcha's api.js
declare var grecaptcha: any;
// These come from the WebpackDefinePlugin
declare var RECAPTCHA_SITEKEY: string | undefined;
declare var USE_RECAPTCHA: boolean;

export const useRecaptcha = USE_RECAPTCHA;

if (!useRecaptcha) {
  console.warn('USE_RECAPTCHA is set to false, reCAPTCHA is disabled');
}

let isReady = false;

window['recaptchaCallback'] = () => isReady = true;

export const getToken = async (action: string = 'generic'): Promise<string> => {
  if (!isReady) {
    throw new Error('reCAPTCHA isn\'t ready yet. Try again in a few seconds');
  }
  return await grecaptcha.execute(RECAPTCHA_SITEKEY, {
    action
  });
}
