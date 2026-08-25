# Caption Position Lock Design

## Goal

Keep YouTube captions at one vertical position while the userscript keeps the control bar visible and YouTube toggles its `ytp-autohide` state.

## Approach

Add a scoped CSS override for every direct caption window child under `.ytp-caption-window-container`. These are the elements YouTube moves when hover or playback state changes the control-bar state. The caption windows will use a fixed bottom offset of `64px`, matching the visible control-bar footprint, with top positioning, transforms, transitions, and bottom margin neutralized. YouTube will continue to control caption content, alignment, and wrapping; only the vertical offset is overridden.

## Alternatives considered

- Observe control-bar mutations and rewrite caption positioning in JavaScript: more timing-sensitive and more coupled to YouTube internals.
- Reposition the caption text nodes individually: risks breaking multi-line and roll-up caption layouts.

## Validation

Run the TypeScript/Vite build, then verify in a rendered YouTube player that captions retain the same bottom offset before and after hovering on and off the player. The final behavior was also confirmed manually after targeting the moving child caption windows.
