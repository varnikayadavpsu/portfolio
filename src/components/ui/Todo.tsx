import { isTodo, type Fillable } from "@/content/types";

/**
 * A dashed "TODO" tag that only shows in `npm run dev`, so open placeholders
 * are easy to spot on localhost and never ship.
 */
export function TodoTag({ value, note, className = "" }: { value?: Fillable<unknown>; note?: string; className?: string }) {
  if (process.env.NODE_ENV !== "development") return null;
  const text = note ?? (isTodo(value) ? value.todo : undefined);
  if (!text) return null;
  return <span className={`todo-tag ${className}`}>TODO: {text}</span>;
}
