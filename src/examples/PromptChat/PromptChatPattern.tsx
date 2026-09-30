import { useState } from "react";
import { cn } from "../../lib/cn";
import { PromptBar } from "../../components/molecules/PromptBar/PromptBar";
import {
  promptChatBarClasses,
  promptChatHeadlineClasses,
  promptChatLandingClasses,
  promptChatPageClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatUserClasses,
} from "./promptChatStyles";

export const promptChatHeadline = "What should we make?";

/** Static sample. The story does not call a model. */
export const promptChatSampleReply =
  "Brand, product, and the sites that explain them. This is sample copy.";

export const promptChatPatternCopySource = `
import { useState } from "react";
import { PromptBar } from "@whatmatters/wmds";

const pageClasses =
  "flex h-full min-h-0 w-full flex-1 flex-col bg-body [--grid-max:40rem]";
const stageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";
const headlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";
const threadClasses = "col-span-full flex flex-col items-start gap-6 pt-12 sm:pt-16";
const userClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";
const replyClasses = "type-body text-fg";
const barClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";

const headline = "What should we make?";
const sampleReply =
  "Brand, product, and the sites that explain them. This is sample copy.";

export function AskWhatMatters() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  return (
    <div className={pageClasses}>
      <main className={sent == null ? stageClasses + " place-content-center" : stageClasses}>
        {sent == null ? (
          <h1 className={headlineClasses}>{headline}</h1>
        ) : (
          <div className={threadClasses}>
            <p className={userClasses}>{sent}</p>
            <p className={replyClasses}>{sampleReply}</p>
          </div>
        )}
      </main>
      <div className={barClasses}>
        <div className="col-span-full">
          <PromptBar
            value={draft}
            onValueChange={setDraft}
            onSend={(value) => {
              setSent(value.trim());
              setDraft("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
`.trim();

/**
 * Landing statement, then one chat exchange. Send or Enter leaves the landing.
 * The reply is static sample copy. Voice and attachments are not part of this version.
 */
export function AskWhatMatters() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  return (
    <div className={promptChatPageClasses}>
      <main className={cn(promptChatStageClasses, sent == null && promptChatLandingClasses)}>
        {sent == null ? (
          <h1 className={promptChatHeadlineClasses}>{promptChatHeadline}</h1>
        ) : (
          <div className={promptChatThreadClasses}>
            <p className={promptChatUserClasses}>{sent}</p>
            <p className={promptChatReplyClasses}>{promptChatSampleReply}</p>
          </div>
        )}
      </main>
      <div className={promptChatBarClasses}>
        <div className="col-span-full">
          <PromptBar
            value={draft}
            onValueChange={setDraft}
            onSend={(value) => {
              setSent(value.trim());
              setDraft("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
