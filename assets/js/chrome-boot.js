// UIUX-014: replaces the inline renderChrome(...) calls. Included right after #chrome-top (header) and again after
// #chrome-footer (footer); options come from #chrome-top's data attributes. renderChrome is idempotent.
renderChrome(chromeOptsFrom(document.getElementById('chrome-top')));
