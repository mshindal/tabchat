const parseEnvironmentVariable = (environmentVariable: string | undefined, type: 'string' | 'number' | 'boolean') => {
  if (environmentVariable === undefined) {
    throw new Error(`Environment variable is missing`);
  } else {
    if (type === 'string') {
      if (environmentVariable === '') {
        throw new Error(`Environment variable is an empty string`);
      }
      return environmentVariable;
    } else if (type === 'number') {
      const parsed = Number(environmentVariable);
      if (parsed === NaN) {
        throw new Error(`Environment variable is supposed to be a number, but couldn't be parsed as one`);
      }
      return parsed;
    } else if (type === 'boolean') {
      if (environmentVariable === 'true' || environmentVariable === '1') {
        return true;
      } else if (environmentVariable === 'false' || environmentVariable === '0') {
        return false;
      } else {
        throw new Error(`Environment variable is supposed to be a boolean, but couldn't be parsed as one`);
      }
    }
  }
}

export default {
  get isProduction() { return parseEnvironmentVariable(process.env.NODE_ENV, 'string') === 'production' },
  get port() { return parseEnvironmentVariable(process.env.PORT, 'number') as number },
  get databaseURL() { return parseEnvironmentVariable(process.env.DATABASE_URL, 'string') as string },
  get useRecaptcha() { return parseEnvironmentVariable(process.env.USE_RECAPTCHA, 'boolean') as boolean },
  get recaptchaSecret() { return parseEnvironmentVariable(process.env.RECAPTCHA_SECRET, 'string') as string },
  get recaptchaSitekey() { return parseEnvironmentVariable(process.env.RECAPTCHA_SITEKEY, 'string') as string },
  get serverURL() { return parseEnvironmentVariable(process.env.SERVER_URL, 'string') as string },
  get maxCommentLength() { return parseEnvironmentVariable(process.env.MAX_COMMENT_LENGTH, 'number') as number },
  get maxCommentDepthToIndent() { return parseEnvironmentVariable(process.env.MAX_COMMENT_DEPTH_TO_INDENT, 'number') as number }
}
