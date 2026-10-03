"use client";

import { useLayoutEffect, useRef } from "react";
import { TextLink } from "../../atoms/TextLink/TextLink";
import { cn } from "../../../lib/cn";
import { footerRevealExternalLinkProps, footerRevealWordmarkFontSize } from "./footerRevealStyles";
import {
  footerRevealRuledContactClasses,
  footerRevealRuledCopyrightClasses,
  footerRevealRuledCreditClasses,
  footerRevealRuledCreditCopyClasses,
  footerRevealRuledEmailClasses,
  footerRevealRuledIdentityClasses,
  footerRevealRuledLinkListClasses,
  footerRevealRuledNavLinkClasses,
  footerRevealRuledLinksClasses,
  footerRevealRuledMarkClasses,
  footerRevealRuledMetaClasses,
  footerRevealRuledRootClasses,
  footerRevealRuledWordmarkClasses,
  footerRevealRuledWordmarkFrameClasses,
} from "./footerRevealStyles";
import { syncFooterRevealWordmark } from "./footerRevealWordmark";

export interface FooterRevealRuledLink {
  label: string;
  href: string;
}

/**
 * Content is the app's: there are no content defaults. `wordmark` is required; every other slot
 * renders only when its prop is set.
 */
export interface FooterRevealRuledProps {
  /** Display wordmark that fills the footer width, e.g. `WhatMatters`. */
  wordmark: string;
  /** Small sans line beside the mark, e.g. `WhatMatters © 2026`. Omit to render none. */
  copyright?: string;
  /** Typographic mark beside the copyright, e.g. `WM` (there is no logo asset). Omit to render none. */
  mark?: string;
  /** Centered footer nav. Omit or pass `[]` to render no nav. */
  links?: readonly FooterRevealRuledLink[];
  /** Visible email address, centered in the quiet row. Omit to render none. */
  email?: string;
  /** Defaults to `mailto:` plus `email`. */
  emailHref?: string;
  /** Credit line on the end of the quiet row. Omit to render none. */
  credit?: string;
  /** Layout only — width or margin. */
  className?: string;
}

/** `mailto:` when the caller does not pass an href. */
export function footerRevealRuledEmailHref(email: string, emailHref?: string): string {
  if (emailHref) return emailHref;
  return `mailto:${email}`;
}

function useFittedWordmark(text: string) {
  const frameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const node = textRef.current;
    if (!frame || !node) return;

    let lastWidth = -1;
    const fit = () => {
      const width = frame.clientWidth;
      if (width <= 0) return;
      if (
        Math.abs(width - lastWidth) < 0.5 &&
        frame.style.getPropertyValue("--footer-wordmark-em")
      ) {
        return;
      }
      lastWidth = width;
      syncFooterRevealWordmark(node, frame);
    };

    fit();

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (Math.abs(frame.clientWidth - lastWidth) < 0.5) return;
            lastWidth = -1;
            fit();
          });
    observer?.observe(frame);

    const fonts = document.fonts;
    const onFonts = () => {
      lastWidth = -1;
      fit();
    };
    fonts?.addEventListener?.("loadingdone", onFonts);
    if (fonts?.ready) void fonts.ready.then(onFonts).catch(() => {});

    return () => {
      observer?.disconnect();
      fonts?.removeEventListener?.("loadingdone", onFonts);
    };
  }, [text]);

  return { frameRef, textRef };
}

function FittedLine({
  text,
  frameClassName,
  textClassName,
  slot,
}: {
  text: string;
  frameClassName: string;
  textClassName: string;
  slot: string;
}) {
  const { frameRef, textRef } = useFittedWordmark(text);

  return (
    <div ref={frameRef} className={frameClassName} data-footer-ruled={`${slot}-frame`}>
      <p
        ref={textRef}
        className={textClassName}
        style={{ fontSize: footerRevealWordmarkFontSize }}
        aria-hidden="true"
        data-footer-ruled={slot}
      >
        {text}
      </p>
    </div>
  );
}

/**
 * Marketing footer on the page background. The shell is at least `100vh` and
 * grows when the content is taller. The link stack, fitted wordmark, and quiet
 * row are one block, vertically centered in the field when that block fits.
 * Top padding still clears the pinned site nav (`--site-nav-height` plus its
 * 1rem pin); a short viewport keeps the block under that nav. A centered link
 * stack, a wordmark fitted to the footer width, then a quiet row: mark and
 * copyright, the email, and the credit. The nav, wordmark, and quiet row are
 * fully visible — they do not crop.
 */
export function FooterRevealRuled({
  wordmark,
  copyright,
  mark,
  links = [],
  email,
  emailHref,
  credit,
  className,
}: FooterRevealRuledProps) {
  const emailLink = email ? footerRevealRuledEmailHref(email, emailHref) : undefined;

  return (
    <div className={cn(footerRevealRuledRootClasses, className)} data-footer-ruled="root">
      {links.length > 0 ? (
        <nav aria-label="Footer" className={footerRevealRuledLinksClasses} data-footer-ruled="links">
          <ul className={footerRevealRuledLinkListClasses}>
            {links.map((link) => (
              <li key={link.href}>
                <TextLink
                  href={link.href}
                  external={/^https?:\/\//i.test(link.href)}
                  className={footerRevealRuledNavLinkClasses}
                >
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <FittedLine
        text={wordmark}
        frameClassName={footerRevealRuledWordmarkFrameClasses}
        textClassName={footerRevealRuledWordmarkClasses}
        slot="wordmark"
      />

      <div className={footerRevealRuledMetaClasses} data-footer-ruled="meta">
        <div className={footerRevealRuledIdentityClasses} data-footer-ruled="identity">
          {mark ? (
            <span className={footerRevealRuledMarkClasses} aria-hidden="true">
              {mark}
            </span>
          ) : null}
          {copyright ? <p className={footerRevealRuledCopyrightClasses}>{copyright}</p> : null}
        </div>
        <div className={footerRevealRuledContactClasses} data-footer-ruled="contact">
          {email && emailLink ? (
            <a
              href={emailLink}
              className={footerRevealRuledEmailClasses}
              {...footerRevealExternalLinkProps(emailLink)}
            >
              {email}
            </a>
          ) : null}
        </div>
        <div className={footerRevealRuledCreditClasses} data-footer-ruled="credit">
          {credit ? <p className={footerRevealRuledCreditCopyClasses}>{credit}</p> : null}
        </div>
      </div>
    </div>
  );
}
