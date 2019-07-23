import 'webextension-polyfill';
import * as io from 'socket.io-client';
import { getCommentCount } from './fetches';
import { Comment } from './models';
import { sendMessage } from './ipc';

console.log(`connecting to websocket at ${SERVER_URL}`);
const socket = io(SERVER_URL);

interface Tab {
  id: number;
  url: string;
  participants?: number;
}

let tabs: Tab[] = [];

const findTabById = (tabId: number) => tabs.find(tab => tab.id === tabId);

const findTabsByUrl = (url: string) => tabs.filter(tab => tab.url === url);

const initializeTabs = async () => {
  const webExtTabs = await browser.tabs.query({});
  tabs = webExtTabs.map(webExtTabToTab);
  tabs.forEach(tab => {
    console.log(`joining ${tab.url}`);
    socket.emit('join', tab.url);
  });
  logTabs();
}

const webExtTabToTab = (webExtTab: browser.tabs.Tab): Tab => ({
  id: webExtTab.id,
  url: webExtTab.url,
  participants: undefined
});

const onNavigation = async (tabId: number, newUrl: string) => {
  getCommentCount(newUrl).then(count => {
    if (count !== 0) {
      browser.browserAction.setBadgeText({
        text: `${count}`,
        tabId
      });
      browser.browserAction.setBadgeBackgroundColor({
        color: '#473bff'
      });
    }
  });

  const tab = findTabById(tabId);
  if (tab === undefined) {
    throw new Error(`onNavigation() was called with a tab ID of ${tabId} but we couldn't find that in our tab array`);
  }

  const oldUrl = tab.url;
  tab.url = newUrl;

  if (findTabsByUrl(oldUrl).length === 0) {
    console.log(`leaving ${oldUrl}`);
    socket.emit('leave', oldUrl);
  }

  if (findTabsByUrl(newUrl).length === 1) {
    console.log(`joining ${newUrl}`);
    socket.emit('join', newUrl);
  }

  logTabs();
}

const onTabRemoved = async (tabId: number) => {
  const tab = findTabById(tabId);
  if (tab === undefined) {
    throw new Error(`onTabRemoved() was called with a tabId of ${tabId} but we couldn't find a tab with that ID in our array`);
  }
  const url = tab.url;

  // remove the tab with `tabId` from `tabs`
  tabs = tabs.filter(t => t.id !== tabId);

  // if there are now no more tabs with that URL, leave that room
  if (tabs.filter(t => t.url === url).length === 0) {
    console.log(`leaving ${url}`);
    socket.emit('leave', url);
  }

  logTabs();
}

const onTabCreated = async (tab: browser.tabs.Tab) => {
  const newTab = webExtTabToTab(tab);

  tabs.push(newTab);

  if (findTabsByUrl(newTab.url).length === 1) {
    console.log(`joining ${newTab.url}`);
    socket.emit('join', newTab.url);
  }

  logTabs();
}

browser.tabs.onRemoved.addListener(onTabRemoved);
browser.tabs.onCreated.addListener(onTabCreated);

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
    onNavigation(details.tabId, details.url);
  }
}));

socket.on('new comment', async (newComment: Comment) => await sendMessage({
  name: 'new comment',
  payload: newComment
}));

socket.on('connect', () => {
  console.log("connected to socket.io");
  initializeTabs();
});

const logTabs = () => console.log('tabs', tabs);
