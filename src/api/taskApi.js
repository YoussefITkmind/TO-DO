/* ---------- API config ---------- */

export const API_BASE = "https://to-do-black-kappa.vercel.app";

/* Convert an API task (status/priority/category lowercase, dueDate/description)
   into the shape the UI already uses (completed/priority/category Capitalized, date/desc) */
export function apiTaskToUiTask(apiTask) {
  return {
    id: apiTask.id,
    title: apiTask.title,
    desc: apiTask.description || "",
    date: apiTask.dueDate ? apiTask.dueDate.slice(0, 10) : "",
    category: apiTask.category
      ? apiTask.category.charAt(0).toUpperCase() + apiTask.category.slice(1)
      : "Personal",
    priority: apiTask.priority
      ? apiTask.priority.charAt(0).toUpperCase() + apiTask.priority.slice(1)
      : "Low",
    completed: apiTask.status === "completed"
  };
}

/* Convert UI fields into the payload shape the API expects */
export function uiFieldsToApiPayload({ title, desc, date, category, priority, completed }) {
  const payload = {
    title,
    status: completed ? "completed" : "pending",
    priority: (priority || "low").toLowerCase(),
    category: (category || "personal").toLowerCase()
  };
  if (desc) payload.description = desc;
  if (date) payload.dueDate = new Date(date + "T00:00:00").toISOString();
  return payload;
}

export async function apiRequest(path, options) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  console.log("API response:", data);
  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }
  return data;
}
