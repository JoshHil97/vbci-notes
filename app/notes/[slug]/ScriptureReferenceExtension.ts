"use client";

import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { SCRIPTURE_POPUPS } from "@/lib/scripture-popups";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getReferencePattern(ref: string) {
  return ref
    .split(/\s*(?:to|-|–|—)\s*/i)
    .map((part) => escapeRegExp(part))
    .map((part) => part.replace(/^Matthew/i, "(?:Matthew|Mathew)"))
    .join("\\s*(?:to|-|–|—)\\s*")
    .replace(/\s+/g, "\\s+");
}

const scriptureMatchers = SCRIPTURE_POPUPS.map((scripture) => ({
  ...scripture,
  pattern: new RegExp(
    `(^|[^\\w])(${getReferencePattern(scripture.ref)})(?=$|[^\\w])`,
    "gi"
  ),
})).sort((a, b) => b.ref.length - a.ref.length);

const ScriptureReferenceExtension = Extension.create({
  name: "scriptureReferenceTooltip",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];

            state.doc.descendants((node, position) => {
              if (!node.isText || !node.text) return;

              const occupiedRanges: Array<{ from: number; to: number }> = [];

              for (const scripture of scriptureMatchers) {
                scripture.pattern.lastIndex = 0;

                let match: RegExpExecArray | null;
                while ((match = scripture.pattern.exec(node.text)) !== null) {
                  const prefixLength = match[1]?.length ?? 0;
                  const reference = match[2];
                  if (!reference) continue;

                  const start = position + match.index + prefixLength;
                  const end = start + reference.length;
                  const overlaps = occupiedRanges.some(
                    (range) => start < range.to && end > range.from
                  );

                  if (overlaps) continue;

                  decorations.push(
                    Decoration.inline(start, end, {
                      class: "scripture-reference",
                      "data-scripture-ref": scripture.ref,
                      "data-scripture-text": scripture.text,
                      tabindex: "0",
                      "aria-label": `${scripture.ref}: ${scripture.text}`,
                    })
                  );

                  occupiedRanges.push({ from: start, to: end });
                }
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

export default ScriptureReferenceExtension;
