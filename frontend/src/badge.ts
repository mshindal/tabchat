import { getCommentCount } from "./fetches";
import { getCurrentTab } from "./utils";

export const updateBadgeWithCount = async () => {
  const currentTab = await getCurrentTab();
  const { id, url } = currentTab;
  const count = await getCommentCount(url);
  if (count === 0) {
    browser.browserAction.setBadgeText({ text: '', tabId: id });
  } else {
    browser.browserAction.setBadgeText({
      text: `${count}`,
      tabId: id
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: '#473bff',
      tabId: id
    });
  }
}
