import DOMPurify from "isomorphic-dompurify";
import { cn } from "./cn";

// Renders admin/instructor-authored HTML from RichTextEditor. Tiptap's
// schema already restricts what can be produced while editing, but this is
// rendered for every visitor, so it's sanitized again here rather than
// trusted at the point of storage.
export function RichTextContent({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote",
      "h2", "h3", "img", "table", "thead", "tbody", "tr", "th", "td", "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "style", "colspan", "rowspan"],
  });

  return (
    <div
      className={cn("rich-text-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
