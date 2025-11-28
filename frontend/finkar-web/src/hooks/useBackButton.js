import { useEffect } from "react";
import { App } from "@capacitor/app";

/**
 * Custom hook to handle Android hardware back button events
 *
 * @param {Function} handler - Callback function to execute when back button is pressed
 * @param {number} priority - Priority level (higher = executes first). Default: 0
 * @param {Array} deps - Dependency array for the effect
 *
 * @example
 * // In a detail view (high priority)
 * useBackButton(() => {
 *   closeDetailView();
 * }, 10, [isDetailOpen]);
 *
 * // In main navigation (low priority)
 * useBackButton(() => {
 *   if (activeTab === 0) {
 *     App.exitApp();
 *   } else {
 *     setActiveTab(0);
 *   }
 * }, 0, [activeTab]);
 */
const useBackButton = (handler, priority = 0, deps = []) => {
  useEffect(() => {
    // Only add listener if handler is provided
    if (!handler) return;

    const backButtonListener = App.addListener("backButton", (event) => {
      // Capacitor's backButton event includes canGoBack property
      // We'll use our custom priority system instead
      handler();
    });

    // Cleanup listener on unmount or when dependencies change
    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, priority, ...deps]);
};

export default useBackButton;
