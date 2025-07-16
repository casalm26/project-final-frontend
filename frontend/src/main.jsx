import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";

/**
 * Validates that the root DOM element exists
 * @param {string} elementId - The ID of the root element to find
 * @returns {HTMLElement} The root element
 * @throws {Error} If root element is not found
 */
const validateRootElement = (elementId = "root") => {
  const rootElement = document.getElementById(elementId);
  
  if (!rootElement) {
    throw new Error(`Root element with id '${elementId}' not found in the document`);
  }
  
  return rootElement;
};

/**
 * Creates and configures the React root
 * @param {HTMLElement} rootElement - The DOM element to render into
 * @returns {Root} The React root instance
 */
const createReactRoot = (rootElement) => {
  return ReactDOM.createRoot(rootElement);
};

/**
 * Renders the application with React.StrictMode
 * @param {Root} root - The React root instance
 */
const renderApp = (root) => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

/**
 * Initialize and render the React application
 * Main entry point that orchestrates the app initialization
 */
const initializeApp = () => {
  try {
    const rootElement = validateRootElement();
    const root = createReactRoot(rootElement);
    renderApp(root);
  } catch (error) {
    console.error("Failed to initialize application:", error);
    throw error;
  }
};

// Initialize the application
initializeApp();
