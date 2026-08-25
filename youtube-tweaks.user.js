// ==UserScript==
// @name         YouTube Tweaks
// @namespace    https://github.com/gino20/youtube-tweaks
// @version      0.0.2
// @description  Keeps YouTube video controls visible
// @license      MIT
// @homepageURL  https://github.com/gino20/youtube-tweaks
// @supportURL   https://github.com/gino20/youtube-tweaks/issues
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://www.youtube-nocookie.com/embed/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
	"use strict";
	var PLAYER_SELECTOR = ".html5-video-player";
	var MARKER_CLASS = "ytp-always-show-controls";
	var STYLE_ID = "youtube-tweaks";
	var CONTROL_STYLE = `
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-bottom,
  .html5-video-player.${MARKER_CLASS} .ytp-chrome-controls,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-bar-container,
  .html5-video-player.${MARKER_CLASS} .ytp-progress-list,
  .html5-video-player.${MARKER_CLASS} .ytp-gradient-bottom {
    opacity: 0.5 !important;
    transition: opacity 200ms ease-in-out !important;
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

  .html5-video-player.${MARKER_CLASS}
    .ytp-caption-window-container > .caption-window.ytp-caption-window-bottom,
  .html5-video-player.${MARKER_CLASS}
    .ytp-caption-window-container > .caption-window.ytp-caption-window-rollup {
    bottom: 64px !important;
    margin-bottom: 0 !important;
  }
`;
	function injectStyle() {
		if (document.getElementById(STYLE_ID)) return;
		const style = document.createElement("style");
		style.id = STYLE_ID;
		style.textContent = CONTROL_STYLE;
		(document.head || document.documentElement).append(style);
	}
	function markPlayer(player) {
		if (!(player instanceof HTMLElement) || player.dataset.ytControlsHoverBound === "true") return;
		player.classList.add(MARKER_CLASS);
		player.dataset.ytControlsHoverBound = "true";
	}
	function markAllPlayersWithin(root) {
		if (root instanceof Element && root.matches(PLAYER_SELECTOR)) markPlayer(root);
		root.querySelectorAll(PLAYER_SELECTOR).forEach(markPlayer);
	}
	function watchForPlayers() {
		new MutationObserver((mutations) => {
			for (const mutation of mutations) for (const node of mutation.addedNodes) if (node instanceof HTMLElement) markAllPlayersWithin(node);
		}).observe(document.documentElement, {
			childList: true,
			subtree: true
		});
	}
	function startUserscript() {
		injectStyle();
		markAllPlayersWithin(document);
		watchForPlayers();
	}
	if (document.documentElement) startUserscript();
	else new MutationObserver((_, observer) => {
		if (!document.documentElement) return;
		observer.disconnect();
		startUserscript();
	}).observe(document, { childList: true });
})();
