import configuration from '../../backend/src/configuration';

// This comes from recaptcha's api.js
declare var grecaptcha: any;

if (!configuration.useRecaptcha) {
  console.warn('USE_RECAPTCHA is set to false, reCAPTCHA is disabled');
}

let isReady = false;

window['recaptchaCallback'] = () => isReady = true;

export const getToken = async (action: string = 'generic'): Promise<string> => {
  if (!isReady) {
    throw new Error('reCAPTCHA isn\'t ready yet. Try again in a few seconds');
  }
  return await grecaptcha.execute(configuration.recaptchaSitekey, {
    action
  });
}
