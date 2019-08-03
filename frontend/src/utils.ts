export const getCurrentUrl = async () => {
  const currentTab = await getCurrentTab();
  return currentTab.url;
}

export const getCurrentTab = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  if (tabs.length !== 1) {
    throw Error(`Tried to get the current tab but instead got ${tabs.length} tabs`);
  }
  return tabs[0];
}
