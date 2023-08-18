import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  WV2EVENTS,
  postWebView2Message,
  subscribeToWebView2Event,
  unsubscribeToWebView2Event,
  isInWebViewContext,
} from "../utils/webview2";

const theme = createTheme({
  palette: {
    primary: {
      main: "#009688",
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" color="secondary" gutterBottom>
          Barn Pros Web | Revit
        </Typography>
        {!isWebView && (
          <Typography variant="h6" color="secondary" gutterBottom>
            You are not in a WebView Context
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => postWebView2Message({ action: "create-sheet" })}
          style={{ marginRight: "10px" }}
        >
          Create Sheet
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            postWebView2Message({
              action: "select",
              payload: elementGuidsToSelect,
            })
          }
          disabled={elementGuidsToSelect.length === 0}
        >
          Select From List
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default RevitDemo;
