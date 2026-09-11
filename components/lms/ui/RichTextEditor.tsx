"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extension-placeholder";
import { FontSize } from "@/lib/tiptap/font-size-extension";
import { cn } from "./cn";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ImagePlusIcon,
  LinkIcon,
  ListBulletIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  TableIcon,
  UndoIcon,
} from "@/components/ui/icons";

const FONT_SIZES = [
  { label: "Small", value: "0.85em" },
  { label: "Normal", value: "" },
  { label: "Large", value: "1.25em" },
  { label: "Huge", value: "1.75em" },
] as const;

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault(); // keep the editor selection intact
        if (!disabled) onClick();
      }}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm font-semibold transition-colors",
        active ? "bg-sage text-white" : "text-ink/70 hover:bg-ink/5",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertImage() {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  const inTable = editor.isActive("table");

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-cream/60 p-1.5">
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeftIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRightIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-ink/10" />

      <select
        title="Font size"
        className="h-8 rounded-md border border-ink/10 bg-white px-1.5 text-xs text-ink/70"
        value={(editor.getAttributes("textStyle").fontSize as string) || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value) editor.chain().focus().setFontSize(value).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
      >
        {FONT_SIZES.map((size) => (
          <option key={size.label} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <input
        title="Text color"
        type="color"
        className="h-8 w-8 cursor-pointer rounded-md border border-ink/10 bg-white p-1"
        value={(editor.getAttributes("textStyle").color as string) || "#1a1a1a"}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />

      <div className="mx-1 h-5 w-px bg-ink/10" />

      <ToolbarButton title="Insert link" active={editor.isActive("link")} onClick={setLink}>
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Insert image" onClick={insertImage}>
        <ImagePlusIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Insert table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon className="h-4 w-4" />
      </ToolbarButton>

      {inTable && (
        <>
          <div className="mx-1 h-5 w-px bg-ink/10" />
          <ToolbarButton title="Add row" onClick={() => editor.chain().focus().addRowAfter().run()}>
            +Row
          </ToolbarButton>
          <ToolbarButton
            title="Add column"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            +Col
          </ToolbarButton>
          <ToolbarButton
            title="Delete row"
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            &minus;Row
          </ToolbarButton>
          <ToolbarButton
            title="Delete column"
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            &minus;Col
          </ToolbarButton>
          <ToolbarButton
            title="Delete table"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            &times;Table
          </ToolbarButton>
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <ToolbarButton
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <UndoIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RedoIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "rich-text-content min-h-[10rem] px-3 py-2.5 text-sm text-ink focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the editor in sync if `value` changes from outside (e.g. loading a
  // different record into the same mounted form) without fighting the
  // cursor on every local keystroke — only sync when the content actually
  // diverges from what's currently in the editor.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "min-h-[13rem] animate-pulse rounded-lg border border-ink/10 bg-cream",
          className,
        )}
      />
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-ink/10 bg-white", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
