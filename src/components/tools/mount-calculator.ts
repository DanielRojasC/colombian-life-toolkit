import { track } from "../../infrastructure/analytics/analytics";
import type { ToolOutcome } from "../../application/tools/form-values";
import type { ResultView } from "./result-view";

const EMPTY_MESSAGE = "Ingresa los datos para calcular tu resultado.";

function clearFieldErrors(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>("[data-error-for]").forEach((element) => {
    element.textContent = "";
    element.hidden = true;
  });
  form
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select")
    .forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  const summary = form.querySelector<HTMLElement>("[data-form-error]");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }
}

function showFieldErrors(
  form: HTMLFormElement,
  errors: { field: string; message: string }[],
): void {
  clearFieldErrors(form);
  const summary = form.querySelector<HTMLElement>("[data-form-error]");
  if (summary) {
    summary.hidden = false;
    summary.textContent = "Revisa los campos marcados antes de calcular.";
  }

  const invalidFields: HTMLElement[] = [];
  errors.forEach((error) => {
    const message = form.querySelector<HTMLElement>(
      `[data-error-for="${CSS.escape(error.field)}"]`,
    );
    if (message) {
      message.hidden = false;
      message.textContent = error.message;
    }

    const field = form.querySelector<HTMLElement>(
      `[name="${CSS.escape(error.field)}"]`,
    );
    if (field) {
      field.setAttribute("aria-invalid", "true");
      invalidFields.push(field);
    }
  });

  invalidFields[0]?.focus();
}

function appendText(
  parent: HTMLElement,
  tag: string,
  className: string,
  text: string,
): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

export function renderEmpty(
  container: HTMLElement,
  message = EMPTY_MESSAGE,
): void {
  container.replaceChildren();
  const panel = document.createElement("div");
  panel.className = "result-empty";
  appendText(panel, "p", "result-empty-title", "Resultado");
  appendText(panel, "p", "result-empty-copy", message);
  container.append(panel);
}

export function renderResult(container: HTMLElement, view: ResultView): void {
  container.replaceChildren();
  const panel = document.createElement("article");
  panel.className = "result-panel";

  appendText(panel, "p", "result-kicker", "Resultado estimado");
  appendText(panel, "h2", "result-title", view.title);
  appendText(panel, "p", "result-value", view.value);

  const list = document.createElement("dl");
  list.className = "result-rows";
  view.rows.forEach((row) => {
    appendText(list, "dt", "", row.label);
    appendText(list, "dd", "", row.value);
  });
  panel.append(list);

  if (view.formula) {
    appendText(panel, "p", "result-formula", view.formula);
  }

  if (view.notes.length > 0) {
    const notes = document.createElement("ul");
    notes.className = "result-notes";
    view.notes.forEach((note) => appendText(notes, "li", "", note));
    panel.append(notes);
  }

  const actions = document.createElement("div");
  actions.className = "result-actions";
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "btn btn-secondary";
  copyButton.textContent = "Copiar resultado";
  copyButton.addEventListener("click", () => {
    void copyText(copyButton, view.copyText);
  });

  const shareButton = document.createElement("button");
  shareButton.type = "button";
  shareButton.className = "btn btn-secondary";
  shareButton.textContent = "Compartir";
  shareButton.addEventListener("click", () => {
    void shareResult(shareButton, view.copyText);
  });
  actions.append(copyButton, shareButton);
  panel.append(actions);

  if (view.table && view.table.rows.length > 0) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = view.table.caption;
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    view.table.columns.forEach((column) =>
      appendText(headRow, "th", "", column),
    );
    head.append(headRow);
    const body = document.createElement("tbody");
    view.table.rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => appendText(tr, "td", "", cell));
      body.append(tr);
    });
    table.append(caption, head, body);
    wrap.append(table);
    panel.append(wrap);
  }

  container.append(panel);
}

async function copyText(
  button: HTMLButtonElement,
  text: string,
): Promise<void> {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copiado";
  } catch {
    button.textContent = "No se pudo copiar";
  }
  window.setTimeout(() => {
    button.textContent = original;
  }, 2000);
}

async function shareResult(
  button: HTMLButtonElement,
  text: string,
): Promise<void> {
  const url = window.location.href;
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  await copyText(button, url);
}

function syncModeGroups(form: HTMLFormElement): void {
  const groups = form.querySelectorAll<HTMLElement>("[data-modes]");
  if (groups.length === 0) {
    return;
  }

  const selected = new FormData(form).get("mode");
  groups.forEach((group) => {
    const modes = group.dataset.modes?.split(" ") ?? [];
    group.hidden = typeof selected !== "string" || !modes.includes(selected);
  });
}

export function mountCalculator<T>(options: {
  toolSlug: string;
  run: (formData: FormData) => ToolOutcome<T>;
  toView: (result: T) => ResultView;
  live?: boolean;
}): void {
  const form = document.querySelector<HTMLFormElement>("[data-calculator]");
  const result = document.querySelector<HTMLElement>("[data-result]");
  if (!form || !result) {
    return;
  }

  track("tool_view", { tool: options.toolSlug });
  renderEmpty(result);
  syncModeGroups(form);

  let started = false;
  let trackedSignature = "";
  let liveTimer = 0;

  const apply = (announceErrors: boolean, trackResult: boolean): void => {
    const outcome = options.run(new FormData(form));
    if (!outcome.ok) {
      if (announceErrors) {
        showFieldErrors(form, outcome.errors);
        track("tool_error", { tool: options.toolSlug });
      } else {
        clearFieldErrors(form);
      }
      renderEmpty(
        result,
        announceErrors ? "Revisa los campos marcados." : EMPTY_MESSAGE,
      );
      return;
    }

    clearFieldErrors(form);
    const view = options.toView(outcome.result);
    renderResult(result, view);
    if (trackResult && trackedSignature !== view.copyText) {
      trackedSignature = view.copyText;
      track("tool_calculation", { tool: options.toolSlug });
      track("tool_result", { tool: options.toolSlug });
    }
    if (announceErrors) {
      result.focus();
    }
  };

  form.addEventListener("input", () => {
    if (!started) {
      started = true;
      track("tool_start", { tool: options.toolSlug });
    }
    if (!options.live) {
      return;
    }
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(() => apply(false, true), 400);
  });

  form.addEventListener("change", () => {
    syncModeGroups(form);
    if (options.live) {
      apply(false, true);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    apply(true, true);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearFieldErrors(form);
      syncModeGroups(form);
      renderEmpty(result);
      trackedSignature = "";
    }, 0);
  });
}
