const chromeWebStoreUpload = require('chrome-webstore-upload');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chromeWebStoreItemProperty = require('chrome-web-store-item-property');

const getEnvVariableOrThrowIfMissing = (envVarName) => {
  const val = process.env[envVarName];
  if (val === undefined) {
    throw new Error(`The environment variable ${envVarName} is missing`);
  }
  return val;
}

const createZipFromExtensionFolder = (pathToZip) => {
  console.log('Zipping extensions folder into extension.zip...');

  if (fs.existsSync(pathToZip)) {
    fs.unlinkSync(pathToZip);
  }

  const output = fs.createWriteStream(pathToZip);
  
  const archive = archiver('zip');

  archive.pipe(output);

  archive.directory(path.join(__dirname, '..', 'extension'), false);

  return archive.finalize();
}

const ensureLocalAndPublishedVersionsDiffer = async () => {
  const manifestPath = path.join(__dirname, '../extension/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  const localVersion = manifest.version;
  const extensionId = getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_EXTENSION_ID');
  const publishedMetadata = await chromeWebStoreItemProperty(extensionId);
  const publishedVersion = publishedMetadata.version;
  if (publishedVersion === localVersion) {
    throw new Error(`Local version (${localVersion}) already exists on the Chrome Web Store.`);
  }
}

const publishToChromeWebStore = async (pathToZip) => {
  const zipFile = fs.createReadStream(pathToZip);

  const [
    extensionId,
    clientId,
    clientSecret,
    refreshToken,
    target
  ] = [
    getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_EXTENSION_ID'),
    getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_CLIENT_ID'),
    getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_CLIENT_SECRET'),
    getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_REFRESH_TOKEN'),
    getEnvVariableOrThrowIfMissing('CHROME_WEBSTORE_TARGET') // default or trustedTesters
  ];

  if (target !== 'default' && target !== 'trustedTesters') {
    throw new Error('Environment variable CHROME_WEBSTORE_TARGET must be either default or trustedTesters');
  }

  const webstore = chromeWebStoreUpload({
    extensionId,
    clientId,
    clientSecret,
    refreshToken
  });

  const token = await webstore.fetchToken();

  console.log('Uploading to Chrome Web Store...');
  await webstore.uploadExisting(zipFile, token);
  
  console.log('Publishing to Chrome Web Store...');
  await webstore.publish(target, token);
}

const main = async () => {
  // Commenting out until the extension is public
  // await ensureLocalAndPublishedVersionsDiffer();
  const pathToZip = path.join(__dirname, '..', 'extension.zip');
  await createZipFromExtensionFolder(pathToZip);
  await publishToChromeWebStore(pathToZip);
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
