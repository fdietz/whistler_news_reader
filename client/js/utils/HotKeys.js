import Mousetrap from 'mousetrap';

export const MAPPINGS = {
  nextFeed: ['ctrl+n', 'ctrl+j', 'command+option+down', 'ctrl-tab'],
  previousFeed: ['ctrl+p', 'ctrl+k', 'command+option+up', 'ctrl-shift-tab'],
  nextEntry: ['n', 'j'],
  previousEntry: ['p', 'k'],
  openEntry: ['o'],
};


export function bindHotKey(mapping, callback) {
  Mousetrap.bind(MAPPINGS[mapping], callback);
}

export function unbindHotKey(mapping) {
  Mousetrap.unbind(MAPPINGS[mapping]);
}
