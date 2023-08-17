import React, { useState, useEffect } from "react";
import {
  WV2EVENTS,
  postWebView2Message,
  subscribeToWebView2Event,
  unsubscribeToWebView2Event,
  isInWebViewContext,
} from "../utils/webview2";

function RevitDemo() {
  const [elementGuids, setElementGuids] = useState([]);
  const [elementGuidsToSelect, setElementGuidsToSelect] = useState([]);
  const isWebView = isInWebViewContext();

  useEffect(() => {
    subscribeToWebView2Event(WV2EVENTS.SelectionChanged, setElementGuids);
    return () => {
      unsubscribeToWebView2Event(WV2EVENTS.SelectionChanged, setElementGuids);
    };
  }, []);

  return (
    <div>
      <p>BPX Meets Revit</p>
      {!isWebView && <p>You are not in a WebView Context</p>}
      <button onClick={() => postWebView2Message({ action: "create-sheet" })}>
        Create Sheet
      </button>
      <button
        onClick={() =>
          postWebView2Message({
            action: "select",
            payload: elementGuidsToSelect,
          })
        }
        disabled={elementGuidsToSelect.length === 0}
      >
        Select From List
      </button>
      {/* Display the selected elements here */}
    </div>
  );
}

export default RevitDemo;
