/**
 * A lightweight analytics service for tracking user events.
 * In a real-world application, this would integrate with a third-party
 * analytics service like Google Analytics, Mixpanel, etc.
 * For this project, it logs events to the browser console for demonstration.
 */

interface EventPayload {
  [key: string]: any;
}

/**
 * Tracks a custom event.
 * @param eventName - The name of the event to track (e.g., 'report_generated').
 * @param payload - An optional object containing additional data about the event.
 */
export const trackEvent = (eventName: string, payload?: EventPayload): void => {
  const timestamp = new Date().toISOString();
  console.log(
    `%c[Analytics Event]%c ${eventName}`,
    'color: #4f46e5; font-weight: bold;',
    'color: inherit;',
    {
      timestamp,
      ...payload,
    }
  );
};
