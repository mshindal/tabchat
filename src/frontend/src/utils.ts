export const getCurrentUrl = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs.length !== 1) {
    throw Error(`Tried to get the current tab but instead got ${tabs.length} tabs`);
  }
  const currentTab = tabs[0];
  return truncateURL(currentTab.url);
}

export const truncateURL = (url: string): string => {
  const parsedUrl = new URL(url);
  return `${parsedUrl.hostname}${parsedUrl.pathname}`;
}
