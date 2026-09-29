"use client";

import { ArrowRight, ArrowUpRight, Briefcase, Camera, CircleDot, Plus, Sparkle, X } from "lucide-react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ButtonIcon } from "../../atoms/Button/ButtonIcon";
import { cn } from "../../../lib/cn";
import { footerRevealExternalLinkProps, footerRevealWordmarkFontSize } from "./footerRevealStyles";
import {
  footerRevealRuledBlurbClasses,
  footerRevealRuledContactClasses,
  footerRevealRuledContactLabelClasses,
  footerRevealRuledContactRowClasses,
  footerRevealRuledCopyrightClasses,
  footerRevealRuledCreditClasses,
  footerRevealRuledCreditCopyClasses,
  footerRevealRuledCreditMarkClasses,
  footerRevealRuledBandClasses,
  footerRevealRuledBandTopClasses,
  footerRevealRuledEmailClasses,
  footerRevealRuledGlyphClasses,
  footerRevealRuledGridClasses,
  footerRevealRuledIdentityClasses,
  footerRevealRuledLinkClasses,
  footerRevealRuledLinkLabelClasses,
  footerRevealRuledLinkListClasses,
  footerRevealRuledLinksClasses,
  footerRevealRuledMarkClasses,
  footerRevealRuledPlusClasses,
  footerRevealRuledRootClasses,
  footerRevealRuledServicesClasses,
  footerRevealRuledSocialCellClasses,
  footerRevealRuledSocialGridClasses,
  footerRevealRuledSplitClasses,
  footerRevealRuledWordmarkClasses,
  footerRevealRuledWordmarkFrameClasses,
} from "./footerRevealStyles";
import { syncFooterRevealWordmark } from "./footerRevealWordmark";

export interface FooterRevealRuledLink {
  label: string;
  href: string;
}

export interface FooterRevealRuledSocial {
  /** Accessible name. The cell has no visible text. */
  label: string;
  href: string;
  /** Lucide glyph. Sized by ButtonIcon. */
  icon: ReactNode;
}

export interface FooterRevealRuledProps {
  /** Small sans line. Default: `WhatMatters © 2026`. */
  copyright?: string;
  /** Short mono blurb under the copyright. */
  blurb?: string;
  /**
   * Typographic mark in the identity cell and the credit bar.
   * Default `WM` — there is no separate logo asset.
   */
  mark?: string;
  /** Footer nav. Default: Services, Resources, About. Each link is an anchor on a dotted rule. */
  links?: readonly FooterRevealRuledLink[];
  /** Label above the email. Default: `Contact us:`. */
  contactLabel?: string;
  /** Visible email address. */
  email?: string;
  /** Defaults to `mailto:` plus `email`. */
  emailHref?: string;
  /** Services line under the email, in the left-aligned contact block. */
  services?: string;
  /**
   * Icon-only social cells. `https` opens in a new tab.
   * Lucide has no brand marks for X, Dribbble, Instagram, or LinkedIn.
   * Defaults stand in with X, CircleDot, Camera, and Briefcase. Sparkle is Lucide's sparkle.
   */
  socials?: readonly FooterRevealRuledSocial[];
  /** Display wordmark that fills the frame. Default: `WhatMatters`. */
  wordmark?: string;
  /** Credit line. Default: `Created by WhatMatters 2024–2026`. */
  credit?: string;
  /** Layout only — width or margin. */
  className?: string;
}

export const footerRevealRuledDefaultLinks: readonly FooterRevealRuledLink[] = [
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

const socialGlyph = { strokeWidth: 1.75 } as const;

/**
 * Lucide has no X, Dribbble, Instagram, or LinkedIn brand marks.
 * X, CircleDot, Camera, and Briefcase stand in. Sparkle is the Lucide sparkle.
 */
export const footerRevealRuledDefaultSocials: readonly FooterRevealRuledSocial[] = [
  { label: "WhatMatters on X", href: "https://x.com/whatmatters", icon: <X {...socialGlyph} /> },
  {
    label: "WhatMatters on Dribbble",
    href: "https://dribbble.com",
    icon: <CircleDot {...socialGlyph} />,
  },
  {
    label: "WhatMatters on Instagram",
    href: "https://www.instagram.com/thewhatmatters",
    icon: <Camera {...socialGlyph} />,
  },
  {
    label: "WhatMatters on LinkedIn",
    href: "https://www.linkedin.com/in/randymdaniel",
    icon: <Briefcase {...socialGlyph} />,
  },
  { label: "WhatMatters highlights", href: "/highlights", icon: <Sparkle {...socialGlyph} /> },
];

export const footerRevealRuledDefaultCopy = {
  copyright: "WhatMatters © 2026",
  blurb:
    "Working with teams ready to focus on what matters. If the week feels noisy, drop us a line and let's bring the work into one calm list.",
  mark: "WM",
  contactLabel: "Contact us:",
  email: "randy@whatmatters.so",
  services: "Brand / Product / Web",
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

function RuledBand({ top = false, children }: { top?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(footerRevealRuledBandClasses, top && footerRevealRuledBandTopClasses)}
      data-footer-ruled="band"
    >
      <div className={footerRevealRuledGridClasses} data-footer-ruled="grid">
        {children}
      </div>
    </div>
  );
}

function RuledPlus({ align }: { align: "start" | "end" }) {
  return (
    <span
      className={cn(footerRevealRuledPlusClasses, align === "end" && "self-end")}
      aria-hidden="true"
      data-footer-ruled="plus"
    >
      <Plus strokeWidth={1.5} />
    </span>
  );
}

/**
 * Ruled-grid marketing footer. Brand ink and 1px brand rules on the page
 * background. Horizontal rules span the footer field. Vertical edges sit on the
 * outer column edges. Below `md` the bands stack and the social cells stay one row.
 */
export function FooterRevealRuled({
  copyright = footerRevealRuledDefaultCopy.copyright,
  blurb = footerRevealRuledDefaultCopy.blurb,
  mark = footerRevealRuledDefaultCopy.mark,
  links = footerRevealRuledDefaultLinks,
  contactLabel = footerRevealRuledDefaultCopy.contactLabel,
  email = footerRevealRuledDefaultCopy.email,
  emailHref,
  services = footerRevealRuledDefaultCopy.services,
  socials = footerRevealRuledDefaultSocials,
  wordmark = footerRevealRuledDefaultCopy.wordmark,
  credit = footerRevealRuledDefaultCopy.credit,
  className,
}: FooterRevealRuledProps) {
  const emailLink = footerRevealRuledEmailHref(email, emailHref);

  return (
    <div className={cn(footerRevealRuledRootClasses, className)} data-footer-ruled="root">
      <RuledBand top>
      <div className={footerRevealRuledSplitClasses}>
        <div className={footerRevealRuledIdentityClasses} data-footer-ruled="identity">
          <div className="flex items-start justify-between gap-4">
            <p className={footerRevealRuledCopyrightClasses}>{copyright}</p>
            <span className={footerRevealRuledMarkClasses} aria-hidden="true">
              {mark}
            </span>
          </div>
          <p className={footerRevealRuledBlurbClasses}>{blurb}</p>
          <RuledPlus align="start" />
        </div>
        <div className={footerRevealRuledLinksClasses} data-footer-ruled="links">
          <nav aria-label="Footer" className="min-w-0">
            <ul className={footerRevealRuledLinkListClasses}>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={footerRevealRuledLinkClasses}
                    {...footerRevealExternalLinkProps(link.href)}
                  >
                    <span className={footerRevealRuledLinkLabelClasses}>{link.label}</span>
                    <span className={footerRevealRuledGlyphClasses} aria-hidden="true">
                      <ArrowUpRight strokeWidth={1.75} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <RuledPlus align="end" />
        </div>
      </div>
      </RuledBand>

      <RuledBand>
      <div className={footerRevealRuledSplitClasses}>
        <div className={footerRevealRuledContactClasses} data-footer-ruled="contact">
          <div className={footerRevealRuledContactRowClasses} data-footer-ruled="contact-block">
            <div className="flex min-w-0 flex-col gap-1">
              <p className={footerRevealRuledContactLabelClasses}>{contactLabel}</p>
              <a
                href={emailLink}
                className={footerRevealRuledEmailClasses}
                {...footerRevealExternalLinkProps(emailLink)}
              >
                {email}
              </a>
            </div>
            <p className={footerRevealRuledServicesClasses}>
              <span className={footerRevealRuledGlyphClasses} aria-hidden="true">
                <ArrowRight strokeWidth={1.75} />
              </span>
              <span>{services}</span>
            </p>
          </div>
        </div>
        <div
          className={footerRevealRuledSocialGridClasses}
          style={{ gridTemplateColumns: `repeat(${Math.max(socials.length, 1)}, minmax(0, 1fr))` }}
          data-footer-ruled="socials"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className={footerRevealRuledSocialCellClasses}
              {...footerRevealExternalLinkProps(social.href)}
            >
              <ButtonIcon size="sm">{social.icon}</ButtonIcon>
            </a>
          ))}
        </div>
      </div>
      </RuledBand>

      <RuledBand>
      <FittedLine
        text={wordmark}
        frameClassName={footerRevealRuledWordmarkFrameClasses}
        textClassName={footerRevealRuledWordmarkClasses}
        slot="wordmark"
      />
      </RuledBand>

      <RuledBand>
      <div className={footerRevealRuledCreditClasses} data-footer-ruled="credit">
        <span className={footerRevealRuledCreditMarkClasses} aria-hidden="true">
          {mark}
        </span>
        <p className={footerRevealRuledCreditCopyClasses}>{credit}</p>
      </div>
      </RuledBand>
    </div>
  );
}
