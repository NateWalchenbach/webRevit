import React, { useState, useEffect } from "react";

// WV2EVENTS object and related functions
export const WV2EVENTS = {
  SelectionChanged: "SelectionChanged",
  getEventName(key) {
    return this[key]?.toLowerCase();
  },
};

const eventCaptureElement = document.createElement("a");

// this is called by WebView2 from C#
window.dispatchWebViewEvent = function dispatchWebViewEvent({
  action,
  payload,
}) {
  console.log(`dispatch requested ${action}`);
  const e = WV2EVENTS.getEventName(action);
  if (e !== undefined) {
    console.log(`dispatching event ${e}`);
    console.log(`event payload : ${payload}`);
    eventCaptureElement.dispatchEvent(new CustomEvent(e, { detail: payload }));
  }
};

function subscribeToWebView2Event(eventName, handler) {
  const e = WV2EVENTS.getEventName(eventName);
  if (e === undefined) {
    return;
  }
  eventCaptureElement.addEventListener(e, handler);
}

function unsubscribeToWebView2Event(eventName, handler) {
  const e = WV2EVENTS.getEventName(eventName);
  if (e === undefined) {
    return;
  }
  eventCaptureElement.removeEventListener(e, handler);
}

function postWebView2Message({ action, payload }) {
  if (!action) {
    return;
  }
  window.chrome?.webview?.postMessage({ action, payload });
}

function isInWebViewContext() {
  return !!window.chrome?.webview;
}

function App() {
  const [elementGuids, setElementGuids] = useState([]);
  const [elementGuidsToSelect, setElementGuidsToSelect] = useState([]);

  useEffect(() => {
    // Subscribe to the WebView2 Event
    const unsubscribe = subscribeToWebView2Event(
      "SelectionChanged",
      handleSetElementGuids
    );

    return () => {
      // Cleanup on component unmount
      unsubscribeToWebView2Event("SelectionChanged", handleSetElementGuids);
    };
  }, []);

  const handleSetElementGuids = (e) => {
    setElementGuids(e.detail);
  };

  const handleCreateSheet = () => {
    postWebView2Message({
      action: "create-sheet",
    });
  };

  const handleSelectGuid = () => {
    postWebView2Message({
      action: "select",
      payload: [...elementGuidsToSelect],
    });
  };

  return (
    <div className="container">
      <p className="text-center title">BPX Meets Revit</p>
      {!isInWebViewContext() && (
        <div className="text-center my-1 error--text">
          You are not in a WebView Context
        </div>
      )}

      <div className="d-flex justify-center">
        <button
          onClick={handleCreateSheet}
          className="mr-1"
          title="Revit API Transaction"
        >
          Create Sheet
        </button>
        <button
          onClick={handleSelectGuid}
          disabled={elementGuidsToSelect.length === 0}
        >
          Select From List
        </button>
      </div>

      <div className="mt-2" style={{ height: "400px" }}>
        <div>Selected Elements</div>
        <div style={{ maxHeight: "320px", overflowY: "scroll" }}>
          {elementGuids.map((el) => (
            <div key={el.id}>
              <div onClick={() => handleElementSelection(el.id)}>
                <div>{el.name}</div>
                <div>{el.id}</div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

function handleElementSelection(id) {
  // Implement the logic when an element is selected
}
