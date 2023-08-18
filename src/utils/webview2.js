export const WV2EVENTS = {
  SelectionChanged: "SelectionChanged",
  getEventName(key) {
    return this[key]?.toLowerCase();
  },
};

const eventCaptureElement = document.createElement("a");

window.dispatchWebViewEvent = function dispatchWebViewEvent({
  action,
  payload,
}) {
  const e = WV2EVENTS.getEventName(action);
  if (e !== undefined) {
    eventCaptureElement.dispatchEvent(new CustomEvent(e, { detail: payload }));
  }
};

export function subscribeToWebView2Event(eventName, handler) {
  const e = WV2EVENTS.getEventName(eventName);
  if (e === undefined) {
    return;
  }
  eventCaptureElement.addEventListener(e, handler);
}

export function unsubscribeToWebView2Event(eventName, handler) {
  const e = WV2EVENTS.getEventName(eventName);
  // console.log(`unsubscribing: ${e}`);
  if (e === undefined) {
    return;
  }
  // console.log(`unsubscribed: ${e}`);
  eventCaptureElement.removeEventListener(e, handler);
}

export function postWebView2Message({ action, payload }) {
  if (!action) {
    return;
  }
  window.chrome?.webview?.postMessage({ action, payload });
}

export function isInWebViewContext() {
  return !!window.chrome?.webview;
}
