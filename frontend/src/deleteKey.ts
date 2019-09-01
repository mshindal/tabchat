const STORAGE_KEY = 'tabchat_deletekey';
const KEY_SIZE_IN_BYTES = 512;

export const getDeleteKey = async () => {
  const { [STORAGE_KEY]: existingKey } = await browser.storage.sync.get(STORAGE_KEY);
  if (existingKey === undefined) {
    console.log('Tried to find an existing delete key, but it was undefined. Generating a new one');
    const newKey = await generateDeleteKey();
    await browser.storage.sync.set({
      [STORAGE_KEY]: newKey
    });
    return newKey;
  } else {
    console.log(`Existing delete key found (${existingKey})`);
    if (typeof existingKey !== 'string') {
      throw new Error(`Delete key should be a string, but it's ${typeof existingKey}`);
    }
    return existingKey;
  }
}

export const generateDeleteKey = async () => {
  const bytes = new Uint8Array(KEY_SIZE_IN_BYTES);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
