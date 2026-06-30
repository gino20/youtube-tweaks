const PLAYER_SELECTOR = ".html5-video-player";
const MARKER_CLASS = "ytp-always-show-controls";
const STYLE_ID = "youtube-tweaks";
const LOG_PREFIX = "[YouTube Tweaks]";

const CONTROL_STYLE = `
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-controls,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-bar-container,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-list,
  .html5-video-player.${MARKER_CLASS} .ytp-gradient-bottom {
    opacity: 0.5 !important;
  }

  .html5-video-player.${MARKER_CLASS}:hover .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS}:hover .ytp-chrome-controls,
  .html5-video-player.${MARKER_CLASS}:hover .ytp-progress-bar-container,
  .html5-video-player.${MARKER_CLASS}:hover .ytp-progress-list,
  .html5-video-player.${MARKER_CLASS}:hover .ytp-gradient-bottom {
    opacity: 1 !important;
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
 * Injects the scoped control-visibility CSS once per page.
 */
function injectStyle(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CONTROL_STYLE;
  (document.head || document.documentElement).append(style);
}

/**
 * Applies the control-visibility marker to an unprocessed YouTube player.
 */
function markPlayer(player: Element): void {
  if (
    !(player instanceof HTMLElement) ||
    player.dataset.ytControlsHoverBound === "true"
  ) {
    return;
  }

  player.classList.add(MARKER_CLASS);
  player.dataset.ytControlsHoverBound = "true";
}

/**
 * Finds YouTube players inside a DOM root and marks each unprocessed player.
 */
function markAllPlayersWithin(root: ParentNode): void {
  if (root instanceof Element && root.matches(PLAYER_SELECTOR)) {
    markPlayer(root);
  }

  root.querySelectorAll(PLAYER_SELECTOR).forEach(markPlayer);
}

/**
 * Observes DOM changes so players added by navigation or lazy rendering are marked.
 */
function watchForPlayers(): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) {
          markAllPlayersWithin(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // window.addEventListener("yt-navigate-finish", () => {
  //   console.log("yt-navigate-finish");
  //   markAllPlayersWithin(document);
  // });
}

/**
 * Initializes the userscript after the document root is ready.
 */
function startUserscript(): void {
  console.log(`${LOG_PREFIX} active`);
  injectStyle();
  markAllPlayersWithin(document);
  watchForPlayers();
}

if (document.documentElement) {
  startUserscript();
} else {
  new MutationObserver((_, observer) => {
    if (!document.documentElement) {
      return;
    }

    observer.disconnect();
    startUserscript();
  }).observe(document, { childList: true });
}
