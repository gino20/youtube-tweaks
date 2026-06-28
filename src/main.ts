const PLAYER_SELECTOR = '.html5-video-player';
const MARKER_CLASS = 'ytp-always-show-controls';
const STYLE_ID = 'youtube-tweaks-always-show-controls-style';
const LOG_PREFIX = '[YouTube Always Show Controls]';

const CONTROL_STYLE = `
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-controls,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-bar-container,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-list,
  .html5-video-player.${MARKER_CLASS} .ytp-gradient-bottom,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-chrome-controls,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-progress-bar-container,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-progress-list,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-gradient-bottom {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
  }

  .html5-video-player.${MARKER_CLASS} .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS}.ytp-autohide .ytp-chrome-bottom {
    display: block !important;
    transform: translateY(0) !important;
  }

  .html5-video-player.${MARKER_CLASS}.ytp-autohide {
    cursor: default !important;
  }
`;

/**
 * Injects the CSS rules that keep YouTube's player controls visible.
 */
function injectControlStyle(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CONTROL_STYLE;
  (document.head || document.documentElement).append(style);
}

/**
 * Marks a YouTube player so the scoped always-visible-controls CSS applies.
 *
 * @param player - The YouTube HTML5 player element.
 */
function markPlayer(player: Element): void {
  player.classList.add(MARKER_CLASS);
}

/**
 * Finds and marks every YouTube player contained within a DOM root.
 *
 * @param root - The document or newly added element to search.
 */
function markPlayersWithin(root: ParentNode): void {
  if (root instanceof Element && root.matches(PLAYER_SELECTOR)) {
    markPlayer(root);
  }

  root.querySelectorAll(PLAYER_SELECTOR).forEach(markPlayer);
}

/**
 * Watches for players created by YouTube's SPA navigation and lazy rendering.
 */
function watchForPlayers(): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          markPlayersWithin(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('yt-navigate-finish', () => {
    markPlayersWithin(document);
  });
}

/**
 * Starts the userscript once the document root is available.
 */
function start(): void {
  console.log(`${LOG_PREFIX} active`);
  injectControlStyle();
  markPlayersWithin(document);
  watchForPlayers();
}

if (document.documentElement) {
  start();
} else {
  new MutationObserver((_, observer) => {
    if (!document.documentElement) {
      return;
    }

    observer.disconnect();
    start();
  }).observe(document, { childList: true });
}
