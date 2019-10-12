import 'webextension-polyfill';
import { updateBadgeWithCount } from './badge';
import { getCurrentTab } from './utils';



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
    updateBadgeWithCount();
  }
}));

getCurrentTab().then(updateBadgeWithCount);
