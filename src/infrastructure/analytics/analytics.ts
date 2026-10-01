export type AnalyticsEventName =
  | "tool_view"
  | "tool_start"
  | "tool_calculation"
  | "tool_error"
  | "tool_result"
  | "related_tool_click"
  | "search";

export type AnalyticsProperties = Record<string, string | number | boolean>;

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties: AnalyticsProperties;
}

/**
 * Client-side event bus. It does not send salary, amounts or other form values.
 * A future provider can listen for `caja:analytics` without changing each tool.
 * `tool_calculation` fires on a successful result. `tool_result` fires with it
 * for synchronous tools, so dashboards must not add those two counts together.
 */
export function track(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
): void {
  if (typeof window === "undefined") {
    return;
  }

  const detail: AnalyticsEvent = { name, properties };
  window.dispatchEvent(new CustomEvent("caja:analytics", { detail }));
}
