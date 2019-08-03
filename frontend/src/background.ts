import 'webextension-polyfill';
import { getCommentCount } from './fetches';
import { getCurrentTab } from './utils';

const updateBadgeWithCount = async (tabId: number, url: string) => {
  const count = await getCommentCount(url);
  if (count !== 0) {
    browser.browserAction.setBadgeText({
      text: `${count}`,
      tabId
    });
    browser.browserAction.setBadgeBackgroundColor({
      color: '#473bff'
    });
  }
}

[
  browser.webNavigation.onCommitted,
  browser.webNavigation.onHistoryStateUpdated
].forEach(event => event.addListener((details) => {
  if ([
    'link',
    'typed',
    'auto_bookmark',
    'reload',
    'keyword'
  ].includes(details.transitionType)) {
    updateBadgeWithCount(details.tabId, details.url);
  }
}));

getCurrentTab().then(tab => updateBadgeWithCount(tab.id, tab.url));
