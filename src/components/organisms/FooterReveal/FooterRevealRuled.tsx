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

export interface FooterRevealRuledProps {
  /** Small sans line beside the mark. Default: `WhatMatters © 2026`. */
  copyright?: string;
  /**
   * Typographic mark beside the copyright.
   * Default `WM` — there is no separate logo asset.
   */
  mark?: string;
  /** Centered footer nav. Default: Services, Resources, About. */
  links?: readonly FooterRevealRuledLink[];
  /** Visible email address. Centered in the quiet row. */
  email?: string;
  /** Defaults to `mailto:` plus `email`. */
  emailHref?: string;
  /** Display wordmark that fills the footer width. Default: `WhatMatters`. */
  wordmark?: string;
  /** Credit line on the end of the quiet row. Default: `Created by WhatMatters 2024–2026`. */
  credit?: string;
  /** Layout only — width or margin. */
  className?: string;
}

export const footerRevealRuledDefaultLinks: readonly FooterRevealRuledLink[] = [
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

export const footerRevealRuledDefaultCopy = {
  copyright: "WhatMatters © 2026",
  mark: "WM",
  email: "randy@whatmatters.so",
  wordmark: "WhatMatters",
  credit: "Created by WhatMatters 2024\u20132026",
} as const;

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
  copyright = footerRevealRuledDefaultCopy.copyright,
  mark = footerRevealRuledDefaultCopy.mark,
  links = footerRevealRuledDefaultLinks,
  email = footerRevealRuledDefaultCopy.email,
  emailHref,
  wordmark = footerRevealRuledDefaultCopy.wordmark,
  credit = footerRevealRuledDefaultCopy.credit,
  className,
}: FooterRevealRuledProps) {
  const emailLink = footerRevealRuledEmailHref(email, emailHref);

  return (
    <div className={cn(footerRevealRuledRootClasses, className)} data-footer-ruled="root">
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

      <FittedLine
        text={wordmark}
        frameClassName={footerRevealRuledWordmarkFrameClasses}
        textClassName={footerRevealRuledWordmarkClasses}
        slot="wordmark"
      />

      <div className={footerRevealRuledMetaClasses} data-footer-ruled="meta">
        <div className={footerRevealRuledIdentityClasses} data-footer-ruled="identity">
          <span className={footerRevealRuledMarkClasses} aria-hidden="true">
            {mark}
          </span>
          <p className={footerRevealRuledCopyrightClasses}>{copyright}</p>
        </div>
        <div className={footerRevealRuledContactClasses} data-footer-ruled="contact">
          <a
            href={emailLink}
            className={footerRevealRuledEmailClasses}
            {...footerRevealExternalLinkProps(emailLink)}
          >
            {email}
          </a>
        </div>
        <div className={footerRevealRuledCreditClasses} data-footer-ruled="credit">
          <p className={footerRevealRuledCreditCopyClasses}>{credit}</p>
        </div>
      </div>
    </div>
  );
}
