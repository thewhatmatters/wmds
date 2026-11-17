import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { buttonStatusHoldMs } from "../components/atoms/Button/Button";
import { PostPage, SamplePostBody, SamplePostHero, samplePost } from "../guides/PostPage/PostPageExample";

/**
 * Browser interaction tests for **Guides/Post page → Pattern — post page**, **DescriptionList**,
 * **SectionCaption**, and **Prose** — run via `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Post page",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetadataPanel: Story = {
  name: "the metadata panel reads as name-and-value pairs with working actions",
  render: () => (
    <PostPage post={samplePost}>
      <SamplePostBody />
    </PostPage>
  ),
  play: async ({ canvas, canvasElement }) => {
    // The caption names the panel; its "/" is decoration.
    const panel = canvas.getByRole("complementary", { name: "Metadata" });
    // The caption is a plain eyebrow (Headings H6, Eyebrow E6) that still names the region.
    const caption = within(panel).getByText("Metadata", { exact: false });
    expect(caption.tagName).toBe("P");
    expect(caption.textContent).toBe("/ Metadata");

    // dl > div > dt + dd
    const list = panel.querySelector("dl");
    if (list == null) throw new Error("Description list is missing");
    const names = [...list.querySelectorAll("dt")].map((dt) => dt.textContent);
    expect(names).toEqual(["Date", "Author", "Reading time", "Categories", "Agents", "Share"]);
    for (const row of list.children) {
      expect(row.tagName).toBe("DIV");
      expect(row.firstElementChild?.tagName).toBe("DT");
      expect(row.lastElementChild?.tagName).toBe("DD");
    }
    expect(getComputedStyle(list.children[0]).borderBottomStyle).toBe("dotted");

    // Categories are tag links; the author is a label.
    expect(within(panel).getByRole("link", { name: "Guides" })).toHaveAttribute("href", "#guides");
    expect(within(panel).queryByRole("link", { name: "Randy Lee" })).toBeNull();

    // Share links stay in the tab (Links K9).
    const share = within(panel).getByRole("link", { name: "LinkedIn" });
    expect(share).not.toHaveAttribute("target");
    expect(share.getAttribute("href")).toContain(encodeURIComponent(samplePost.url));

    // Copy for LLM copies the markdown and confirms.
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    try {
      const copy = within(panel).getByRole("button", { name: "Copy for LLM" });
      await userEvent.click(copy);
      expect(writeText).toHaveBeenCalledWith(samplePost.markdown);
      await waitFor(() => {
        expect(copy).toHaveTextContent("Copied");
      });
      // Let the confirmation hold and the morph back finish, so the accessibility scan sees a settled pill.
      await waitFor(
        () => {
          expect(copy).toHaveAttribute("data-status", "idle");
          const labels = [...copy.querySelectorAll<HTMLElement>("[data-motion-pop-id], span.inline-block")];
          expect(copy.textContent).toBe("Copy for LLM");
          for (const label of labels) expect(getComputedStyle(label).opacity).toBe("1");
        },
        { timeout: buttonStatusHoldMs + 3000 },
      );
    } finally {
      writeText.mockRestore();
    }

    // The article is set by Prose from plain elements.
    const prose = canvasElement.querySelector<HTMLElement>("[data-prose]");
    if (prose == null) throw new Error("Prose is missing");
    // Without a hero there is no frame: the text follows the caption.
    expect(canvasElement.querySelector("figure")).toBeNull();
    expect(prose.previousElementSibling).toHaveTextContent("/ Article");
    // It fills the article's column: no measure caps it.
    expect(getComputedStyle(prose).maxWidth).toBe("none");
    const column = prose.parentElement;
    if (column == null) throw new Error("Article column is missing");
    expect(Math.round(prose.getBoundingClientRect().width)).toBe(Math.round(column.getBoundingClientRect().width));
    const paragraph = prose.querySelector("p");
    if (paragraph == null) throw new Error("Article paragraph is missing");
    expect(getComputedStyle(paragraph).fontSize).toBe("17px");
    const heading = prose.querySelector("h2");
    if (heading == null) throw new Error("Article heading is missing");
    expect(Number.parseFloat(getComputedStyle(heading).fontSize)).toBeGreaterThan(17);
    // Body text is the secondary ink; headings, strong text, links, and code keep the primary ink.
    const title = canvas.getByRole("heading", { level: 1 });
    const primaryInk = getComputedStyle(title).color;
    const bodyInk = getComputedStyle(paragraph).color;
    expect(bodyInk).not.toBe(primaryInk);
    expect(getComputedStyle(heading).color).toBe(primaryInk);
    for (const selector of ["li", "blockquote p"]) {
      const element = prose.querySelector(selector);
      if (element == null) throw new Error(`Article ${selector} is missing`);
      expect(getComputedStyle(element).color).toBe(bodyInk);
    }
    for (const selector of ["strong", "a", "code", "pre"]) {
      const element = prose.querySelector(selector);
      if (element == null) throw new Error(`Article ${selector} is missing`);
      expect(getComputedStyle(element).color).toBe(primaryInk);
    }
    expect(Number.parseFloat(getComputedStyle(heading).marginTop)).toBeGreaterThan(
      Number.parseFloat(getComputedStyle(paragraph.nextElementSibling ?? paragraph).marginBottom),
    );

    // From lg the panel sits beside the article and sticks.
    if (window.matchMedia("(min-width: 1024px)").matches) {
      expect(getComputedStyle(panel).position).toBe("sticky");
      const article = prose.getBoundingClientRect();
      expect(panel.getBoundingClientRect().right).toBeLessThan(article.left);
    }
  },
};

export const PanelAfterArticle: Story = {
  name: "by default the panel follows the article in the markup, with the date and reading time under the title",
  render: () => (
    <PostPage post={samplePost} metadataSide="end" metadataColumns={3}>
      <SamplePostBody />
    </PostPage>
  ),
  play: async ({ canvas, canvasElement }) => {
    const panel = canvas.getByRole("complementary", { name: "Metadata" });
    const prose = canvasElement.querySelector<HTMLElement>("[data-prose]");
    if (prose == null) throw new Error("Prose is missing");
    // Source order is article, then panel — no order utility moves it at any width.
    expect(prose.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(panel.className).not.toContain("order-");

    const header = canvasElement.querySelector("header");
    if (header == null) throw new Error("Header is missing");
    const summary = header.querySelector("p:last-of-type");
    expect(summary).toHaveTextContent("Sep 14, 2026");
    expect(summary).toHaveTextContent("6 min read");
    expect(summary?.querySelector("time")).toHaveAttribute("datetime", "2026-09-14");
    // It hides from lg, where the panel is beside the article.
    expect(summary?.className).toContain("lg:hidden");
  },
};

export const ArticleAtReadingMeasure: Story = {
  name: "articleMeasure reading caps the article at 40rem inside its column",
  render: () => (
    <PostPage post={samplePost} metadataSide="end" metadataColumns={3} articleMeasure="reading">
      <SamplePostBody />
    </PostPage>
  ),
  play: async ({ canvasElement }) => {
    const prose = canvasElement.querySelector<HTMLElement>("[data-prose]");
    if (prose == null) throw new Error("Prose is missing");
    expect(Number.parseFloat(getComputedStyle(prose).maxWidth)).toBe(640);
    expect(prose.getBoundingClientRect().width).toBeLessThanOrEqual(640);
  },
};

export const HeroInArticleColumn: Story = {
  name: "hero sits under the Article caption at the column's full width, also at the reading measure",
  render: () => (
    <PostPage
      post={samplePost}
      hero={<SamplePostHero />}
      metadataSide="end"
      metadataColumns={3}
      articleMeasure="reading"
    >
      <SamplePostBody />
    </PostPage>
  ),
  play: async ({ canvas, canvasElement }) => {
    const picture = canvas.getByRole("img", { name: /sprint board/ });
    const frame = picture.closest("figure");
    if (frame == null) throw new Error("Hero frame is missing");
    const prose = canvasElement.querySelector<HTMLElement>("[data-prose]");
    if (prose == null) throw new Error("Prose is missing");
    const column = frame.parentElement;
    if (column == null) throw new Error("Article column is missing");

    // Caption, hero, text — in that order, in the article's column.
    expect(frame.previousElementSibling).toHaveTextContent("/ Article");
    expect(frame.nextElementSibling).toBe(prose);
    // One picture in the page: the hero is not repeated inside the article.
    expect(canvas.getAllByRole("img")).toHaveLength(1);

    // The frame and the picture fill the column; the text below is capped at 40rem.
    const columnWidth = Math.round(column.getBoundingClientRect().width);
    expect(Math.round(frame.getBoundingClientRect().width)).toBe(columnWidth);
    expect(Math.round(picture.getBoundingClientRect().width)).toBe(columnWidth);
    expect(prose.getBoundingClientRect().width).toBeLessThanOrEqual(640);
    if (window.matchMedia("(min-width: 1024px)").matches) {
      expect(frame.getBoundingClientRect().width).toBeGreaterThan(prose.getBoundingClientRect().width);
    }

    // The picture keeps its own shape (16:9), and its space is held by its width and height.
    await waitFor(() => {
      const box = picture.getBoundingClientRect();
      expect(Math.abs(box.height - (box.width * 9) / 16)).toBeLessThan(1.5);
    });
    expect(Math.round(frame.getBoundingClientRect().height)).toBe(Math.round(picture.getBoundingClientRect().height));

    // Rounded corners, clipped to the frame, with a hairline drawn over the picture's edge.
    const frameStyle = getComputedStyle(frame);
    expect(Number.parseFloat(frameStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(frameStyle.overflow).toBe("hidden");
    const hairline = getComputedStyle(frame, "::after");
    expect(hairline.borderTopWidth).toBe("1px");
    expect(hairline.borderTopStyle).toBe("solid");
    expect(hairline.pointerEvents).toBe("none");

    // Nothing runs past the page.
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  },
};

export const PanelBeforeArticle: Story = {
  name: "metadataStack before puts the panel first in the markup and drops the line under the title",
  render: () => (
    <PostPage post={samplePost} metadataStack="before">
      <SamplePostBody />
    </PostPage>
  ),
  play: async ({ canvas, canvasElement }) => {
    const panel = canvas.getByRole("complementary", { name: "Metadata" });
    const prose = canvasElement.querySelector<HTMLElement>("[data-prose]");
    if (prose == null) throw new Error("Prose is missing");
    expect(panel.compareDocumentPosition(prose) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(panel.className).not.toContain("order-");
    expect(canvasElement.querySelector("header time")).toBeNull();
  },
};
