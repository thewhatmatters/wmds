import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { motionTransitionProp } from "../../lib/motion";
import { Button } from "../../components/atoms/Button/Button";
import { IconButton } from "../../components/atoms/IconButton/IconButton";
import { TextLink } from "../../components/atoms/TextLink/TextLink";
import { PromptBar } from "../../components/molecules/PromptBar/PromptBar";
import { SiteNav } from "../../components/organisms/SiteNav/SiteNav";
import {
  promptChatActionsClasses,
  promptChatBarClasses,
  promptChatColumnClasses,
  promptChatFollowUpsClasses,
  promptChatHeadlineClasses,
  promptChatLandingClasses,
  promptChatPageClasses,
  promptChatReplyClasses,
  promptChatStageClasses,
  promptChatThreadClasses,
  promptChatUserClasses,
} from "./promptChatStyles";
import {
  promptChatFollowUps,
  promptChatPartDelay,
  promptChatReplyParts,
  promptChatSampleReply,
} from "./promptChatStream";

export const promptChatHeadline = "What should we make?";

const sentLineLayoutId = "prompt-chat-sent-line";

type Point = { top: number; left: number };

export const promptChatPatternCopySource = `
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Copy, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Button, IconButton, PromptBar, SiteNav, TextLink, motionTransitionProp } from "@whatmatters/wmds";

const pageClasses = "flex h-full min-h-0 w-full flex-1 flex-col bg-body";
const columnClasses = "flex min-h-0 w-full flex-1 flex-col [--grid-max:40rem]";
const stageClasses = "grid-page min-h-0 w-full flex-1 overflow-y-auto !py-0";
const landingClasses = "place-content-center";
const headlineClasses =
  "col-span-full type-display-2 !font-normal text-balance text-center text-brand";
const threadClasses = "col-span-full flex flex-col items-start gap-6 pt-6";
const userClasses =
  "ml-auto max-w-full rounded-full bg-fill-selected px-4 py-2 type-body text-fg";
const replyClasses = "type-body text-fg";
const actionsClasses = "flex items-center gap-1";
const followUpsClasses = "flex flex-col items-start gap-2";
const barClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";

const headline = "What should we make?";
const sampleReply =
  "Brand, product, and the sites that explain them. The studio notes cover how a project starts.";
const wordStaggerSeconds = 0.06;
const replyParts = [
  { kind: "word", text: "Brand," },
  { kind: "word", text: "product," },
  { kind: "word", text: "and" },
  { kind: "word", text: "the" },
  { kind: "word", text: "sites" },
  { kind: "word", text: "that" },
  { kind: "word", text: "explain" },
  { kind: "word", text: "them." },
  { kind: "word", text: "The" },
  { kind: "source", text: "studio notes", href: "/notes" },
  { kind: "word", text: "cover" },
  { kind: "word", text: "how" },
  { kind: "word", text: "a" },
  { kind: "word", text: "project" },
  { kind: "word", text: "starts." },
];
const followUps = [
  "What does a brand engagement include?",
  "How do you start a product design?",
];
const sentLineLayoutId = "prompt-chat-sent-line";

type Point = { top: number; left: number };
type ReplyPart = (typeof replyParts)[number];

function partDelay(index: number, reduce: boolean, settleSeconds: number) {
  if (reduce || index <= 0) return 0;
  let time = 0;
  for (let i = 0; i < index; i += 1) {
    const part = replyParts[i];
    const next = replyParts[i + 1];
    const hold = part?.kind === "source" || next?.kind === "source";
    time += hold ? settleSeconds : wordStaggerSeconds;
  }
  return time;
}

export function AskWhatMatters() {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fast = motionTransitionProp("fast");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [settled, setSettled] = useState(false);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);
  const [replyWaits, setReplyWaits] = useState(false);
  const [streamKey, setStreamKey] = useState(0);
  const [streamDone, setStreamDone] = useState(false);
  const [mark, setMark] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (reduce || origin == null || settled) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [reduce, origin, settled]);

  function goHome() {
    setSent(null);
    setDraft("");
    setOrigin(null);
    setSettled(false);
    setHeadlineExit(null);
    setReplyWaits(false);
    setStreamDone(false);
    setMark(null);
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(sampleReply).catch(() => undefined);
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    const fromLanding = sent == null;
    const field = fieldRef.current?.getBoundingClientRect();
    const title = headlineRef.current?.getBoundingClientRect();
    setSent(text);
    setDraft("");
    setMark(null);
    setStreamKey((key) => key + 1);
    setStreamDone(reduce);
    const skipTravel = reduce || !fromLanding || field == null;
    setReplyWaits(!skipTravel);
    if (skipTravel) {
      setOrigin(null);
      setSettled(true);
      setHeadlineExit(null);
      return;
    }
    setOrigin({ top: field.top, left: field.left });
    setSettled(false);
    setHeadlineExit(title == null ? null : { top: title.top, left: title.left });
  }

  const travelSeconds = typeof travel.duration === "number" ? travel.duration : 0;
  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;
  const replyBase = reduce || !replyWaits ? 0 : travelSeconds;

  return (
    <LayoutGroup>
      <div className={pageClasses}>
        {sent != null ? (
          <div onClick={onBrandClick}>
            <SiteNav
              start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />}
              middle={
                <SiteNav.Links>
                  <SiteNav.Link href="/product" current>Product</SiteNav.Link>
                  <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
                  <SiteNav.Link href="/customers">Customers</SiteNav.Link>
                </SiteNav.Links>
              }
              end={
                <>
                  <Button role="ghost" size="sm" render={<a href="/signin" />} className="whitespace-nowrap">Sign in</Button>
                  <Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">Get started</Button>
                </>
              }
              mobile={
                <>
                  <SiteNav.MobileLink href="/product" current>Product</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/pricing">Pricing</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/customers">Customers</SiteNav.MobileLink>
                </>
              }
            />
          </div>
        ) : null}
        <div className={columnClasses}>
          <main className={sent == null ? stageClasses + " " + landingClasses : stageClasses}>
            {sent == null ? (
              <h1 ref={headlineRef} className={headlineClasses}>{headline}</h1>
            ) : (
              <div className={threadClasses}>
                {settled ? (
                  <motion.p layoutId={sentLineLayoutId} className={userClasses} transition={travel}>
                    {sent}
                  </motion.p>
                ) : (
                  <span className="sr-only">{sent}</span>
                )}
                <p key={streamKey} className={replyClasses} aria-busy={streamDone ? undefined : true}>
                  {replyParts.map((part, index) => (
                    <ReplyWord
                      key={part.kind + "-" + index}
                      part={part}
                      index={index}
                      reduce={reduce}
                      delay={replyBase + partDelay(index, reduce, settleSeconds)}
                      settle={fast}
                      onDone={index === replyParts.length - 1 ? () => setStreamDone(true) : undefined}
                    />
                  ))}
                </p>
                {streamDone ? (
                  <>
                    <motion.div
                      className={actionsClasses}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={reduce ? { duration: 0 } : fast}
                    >
                      <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
                      <IconButton
                        aria-label="Mark this reply helpful"
                        size="sm"
                        icon={<ThumbsUp />}
                        aria-pressed={mark === "up"}
                        onClick={() => setMark((current) => (current === "up" ? null : "up"))}
                      />
                      <IconButton
                        aria-label="Mark this reply not helpful"
                        size="sm"
                        icon={<ThumbsDown />}
                        aria-pressed={mark === "down"}
                        onClick={() => setMark((current) => (current === "down" ? null : "down"))}
                      />
                    </motion.div>
                    <div className={followUpsClasses}>
                      {followUps.map((prompt) => (
                        <Button key={prompt} role="ghost" size="sm" type="button" onClick={() => send(prompt)}>
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </main>
          <div className={barClasses}>
            <div className="col-span-full">
              <PromptBar ref={fieldRef} value={draft} onValueChange={setDraft} onSend={send} />
            </div>
          </div>
        </div>
        {origin != null && !settled ? (
          <motion.p
            layoutId={sentLineLayoutId}
            className={userClasses + " pointer-events-none fixed z-10"}
            style={{ top: origin.top, left: origin.left }}
            initial={false}
            transition={travel}
          >
            {sent}
          </motion.p>
        ) : null}
        {headlineExit != null ? (
          <motion.p
            aria-hidden
            className={headlineClasses + " pointer-events-none fixed z-10 m-0"}
            style={{ top: headlineExit.top, left: headlineExit.left }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            transition={travel}
            onAnimationComplete={() => setHeadlineExit(null)}
          >
            {headline}
          </motion.p>
        ) : null}
      </div>
    </LayoutGroup>
  );
}

function ReplyWord({
  part,
  index,
  reduce,
  delay,
  settle,
  onDone,
}: {
  part: ReplyPart;
  index: number;
  reduce: boolean;
  delay: number;
  settle: { duration?: number; ease?: unknown };
  onDone?: () => void;
}) {
  return (
    <motion.span
      className="inline"
      initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={reduce ? { duration: 0 } : { ...settle, delay }}
      onAnimationComplete={onDone}
    >
      {index > 0 ? " " : null}
      {part.kind === "source" ? <TextLink href={part.href}>{part.text}</TextLink> : part.text}
    </motion.span>
  );
}
`.trim();

/**
 * Landing statement, then one chat exchange.
 * Send or Enter: the bar stays, the headline fades, the sent line travels into the trailing pill,
 * then the reply streams word by word. A source link arrives with the words around it.
 * Actions and follow-up prompts appear when the stream finishes. The chat keeps SiteNav;
 * the brand mark returns to the landing.
 * Reduced motion skips the travel and shows the finished reply. Voice and attachments are not part of this version.
 */
export function AskWhatMatters() {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fast = motionTransitionProp("fast");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [settled, setSettled] = useState(false);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);
  const [replyWaits, setReplyWaits] = useState(false);
  const [streamKey, setStreamKey] = useState(0);
  const [streamDone, setStreamDone] = useState(false);
  const [mark, setMark] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (reduce || origin == null || settled) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [reduce, origin, settled]);

  function goHome() {
    setSent(null);
    setDraft("");
    setOrigin(null);
    setSettled(false);
    setHeadlineExit(null);
    setReplyWaits(false);
    setStreamDone(false);
    setMark(null);
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function copyReply() {
    if (typeof navigator === "undefined" || navigator.clipboard == null) return;
    void navigator.clipboard.writeText(promptChatSampleReply).catch(() => undefined);
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    const fromLanding = sent == null;
    const field = fieldRef.current?.getBoundingClientRect();
    const title = headlineRef.current?.getBoundingClientRect();
    setSent(text);
    setDraft("");
    setMark(null);
    setStreamKey((key) => key + 1);
    setStreamDone(reduce);
    const skipTravel = reduce || !fromLanding || field == null;
    setReplyWaits(!skipTravel);
    if (skipTravel) {
      setOrigin(null);
      setSettled(true);
      setHeadlineExit(null);
      return;
    }
    setOrigin({ top: field.top, left: field.left });
    setSettled(false);
    setHeadlineExit(title == null ? null : { top: title.top, left: title.left });
  }

  const travelSeconds = typeof travel.duration === "number" ? travel.duration : 0;
  const settleSeconds = typeof fast.duration === "number" ? fast.duration : 0.175;
  const replyBase = reduce || !replyWaits ? 0 : travelSeconds;

  return (
    <LayoutGroup>
      <div className={promptChatPageClasses}>
        {sent != null ? (
          <div onClick={onBrandClick}>
            <SiteNav
              start={<SiteNav.Brand href="/" aria-label="WhatMatters" icon={<Sparkles />} />}
              middle={
                <SiteNav.Links>
                  <SiteNav.Link href="/product" current>
                    Product
                  </SiteNav.Link>
                  <SiteNav.Link href="/pricing">Pricing</SiteNav.Link>
                  <SiteNav.Link href="/customers">Customers</SiteNav.Link>
                </SiteNav.Links>
              }
              end={
                <>
                  <Button role="ghost" size="sm" render={<a href="/signin" />} className="whitespace-nowrap">
                    Sign in
                  </Button>
                  <Button role="primary" size="sm" render={<a href="/start" />} className="whitespace-nowrap">
                    Get started
                  </Button>
                </>
              }
              mobile={
                <>
                  <SiteNav.MobileLink href="/product" current>
                    Product
                  </SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/pricing">Pricing</SiteNav.MobileLink>
                  <SiteNav.MobileLink href="/customers">Customers</SiteNav.MobileLink>
                </>
              }
            />
          </div>
        ) : null}
        <div className={promptChatColumnClasses}>
          <main className={cn(promptChatStageClasses, sent == null && promptChatLandingClasses)}>
            {sent == null ? (
              <h1 ref={headlineRef} className={promptChatHeadlineClasses}>
                {promptChatHeadline}
              </h1>
            ) : (
              <div className={promptChatThreadClasses}>
                {settled ? (
                  <motion.p layoutId={sentLineLayoutId} className={promptChatUserClasses} transition={travel}>
                    {sent}
                  </motion.p>
                ) : (
                  <span className="sr-only">{sent}</span>
                )}
                <p
                  key={streamKey}
                  className={promptChatReplyClasses}
                  aria-busy={streamDone ? undefined : true}
                >
                  {promptChatReplyParts.map((part, index) => (
                    <motion.span
                      key={`${part.kind}-${index}`}
                      className="inline"
                      initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { ...fast, delay: replyBase + promptChatPartDelay(index, false, settleSeconds) }
                      }
                      onAnimationComplete={
                        index === promptChatReplyParts.length - 1 ? () => setStreamDone(true) : undefined
                      }
                    >
                      {index > 0 ? " " : null}
                      {part.kind === "source" ? (
                        <TextLink href={part.href}>{part.text}</TextLink>
                      ) : (
                        part.text
                      )}
                    </motion.span>
                  ))}
                </p>
                {streamDone ? (
                  <>
                    <motion.div
                      className={promptChatActionsClasses}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={reduce ? { duration: 0 } : fast}
                    >
                      <IconButton aria-label="Copy reply" size="sm" icon={<Copy />} onClick={copyReply} />
                      <IconButton
                        aria-label="Mark this reply helpful"
                        size="sm"
                        icon={<ThumbsUp />}
                        aria-pressed={mark === "up"}
                        onClick={() => setMark((current) => (current === "up" ? null : "up"))}
                      />
                      <IconButton
                        aria-label="Mark this reply not helpful"
                        size="sm"
                        icon={<ThumbsDown />}
                        aria-pressed={mark === "down"}
                        onClick={() => setMark((current) => (current === "down" ? null : "down"))}
                      />
                    </motion.div>
                    <div className={promptChatFollowUpsClasses}>
                      {promptChatFollowUps.map((prompt) => (
                        <Button key={prompt} role="ghost" size="sm" type="button" onClick={() => send(prompt)}>
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </main>
          <div className={promptChatBarClasses}>
            <div className="col-span-full">
              <PromptBar ref={fieldRef} value={draft} onValueChange={setDraft} onSend={send} />
            </div>
          </div>
        </div>
        {origin != null && !settled ? (
          <motion.p
            layoutId={sentLineLayoutId}
            className={cn(promptChatUserClasses, "pointer-events-none fixed z-10")}
            style={{ top: origin.top, left: origin.left }}
            initial={false}
            transition={travel}
          >
            {sent}
          </motion.p>
        ) : null}
        {headlineExit != null ? (
          <motion.p
            aria-hidden
            className={cn(promptChatHeadlineClasses, "pointer-events-none fixed z-10 m-0")}
            style={{ top: headlineExit.top, left: headlineExit.left }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            transition={travel}
            onAnimationComplete={() => setHeadlineExit(null)}
          >
            {promptChatHeadline}
          </motion.p>
        ) : null}
      </div>
    </LayoutGroup>
  );
}
