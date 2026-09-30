import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Sparkles } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { motionTransitionProp } from "../../lib/motion";
import { Button } from "../../components/atoms/Button/Button";
import { PromptBar } from "../../components/molecules/PromptBar/PromptBar";
import { SiteNav } from "../../components/organisms/SiteNav/SiteNav";
import {
  promptChatBarClasses,
  promptChatColumnClasses,
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

const sentLineLayoutId = "prompt-chat-sent-line";

type Point = { top: number; left: number };

export const promptChatPatternCopySource = `
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Sparkles } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Button, PromptBar, SiteNav, motionTransitionProp } from "@whatmatters/wmds";

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
const barClasses = "grid-page w-full shrink-0 !pt-0 !pb-6";

const headline = "What should we make?";
const sampleReply =
  "Brand, product, and the sites that explain them. This is sample copy.";
const sentLineLayoutId = "prompt-chat-sent-line";

type Point = { top: number; left: number };

export function AskWhatMatters() {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [settled, setSettled] = useState(false);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);

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
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    const field = fieldRef.current?.getBoundingClientRect();
    const title = headlineRef.current?.getBoundingClientRect();
    setSent(text);
    setDraft("");
    if (reduce || field == null) {
      setOrigin(null);
      setSettled(true);
      setHeadlineExit(null);
      return;
    }
    setOrigin({ top: field.top, left: field.left });
    setSettled(false);
    setHeadlineExit(title == null ? null : { top: title.top, left: title.left });
  }

  const replyTransition = reduce
    ? { duration: 0 }
    : { ...motionTransitionProp("fast"), delay: typeof travel.duration === "number" ? travel.duration : 0 };

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
                  <motion.p
                    layoutId={sentLineLayoutId}
                    className={userClasses}
                    transition={travel}
                  >
                    {sent}
                  </motion.p>
                ) : (
                  <span className="sr-only">{sent}</span>
                )}
                <motion.p
                  className={replyClasses}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={replyTransition}
                >
                  {sampleReply}
                </motion.p>
              </div>
            )}
          </main>
          <div className={barClasses}>
            <div className="col-span-full">
              <PromptBar
                ref={fieldRef}
                value={draft}
                onValueChange={setDraft}
                onSend={send}
              />
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
`.trim();

/**
 * Landing statement, then one chat exchange.
 * Send or Enter: the bar stays, the headline fades, the sent line travels into the trailing pill,
 * then the reply fades in. The chat keeps SiteNav; the brand mark returns to the landing.
 * Reduced motion skips the travel and shows the end state. Voice and attachments are not part of this version.
 */
export function AskWhatMatters() {
  const reduce = useReducedMotion() === true;
  const travel = motionTransitionProp("medium");
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [settled, setSettled] = useState(false);
  const [headlineExit, setHeadlineExit] = useState<Point | null>(null);

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
  }

  function onBrandClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const home = target.closest("a[aria-label='WhatMatters']");
    if (home == null) return;
    event.preventDefault();
    goHome();
  }

  function send(value: string) {
    const text = value.trim();
    if (text.length === 0) return;
    const field = fieldRef.current?.getBoundingClientRect();
    const title = headlineRef.current?.getBoundingClientRect();
    setSent(text);
    setDraft("");
    if (reduce || field == null) {
      setOrigin(null);
      setSettled(true);
      setHeadlineExit(null);
      return;
    }
    setOrigin({ top: field.top, left: field.left });
    setSettled(false);
    setHeadlineExit(title == null ? null : { top: title.top, left: title.left });
  }

  const replyTransition = reduce
    ? { duration: 0 }
    : { ...motionTransitionProp("fast"), delay: typeof travel.duration === "number" ? travel.duration : 0 };

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
                <motion.p
                  className={promptChatReplyClasses}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={replyTransition}
                >
                  {promptChatSampleReply}
                </motion.p>
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
