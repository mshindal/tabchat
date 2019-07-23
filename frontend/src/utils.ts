export const getCurrentUrl = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs.length !== 1) {
    throw Error(`Tried to get the current tab but instead got ${tabs.length} tabs`);
  }
  const currentTab = tabs[0];
  return currentTab.url;
}
