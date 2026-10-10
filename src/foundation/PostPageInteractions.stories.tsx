import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { buttonStatusHoldMs } from "../components/atoms/Button/Button";
import { PostPage, SamplePostBody, samplePost } from "../guides/PostPage/PostPageExample";

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
    const caption = within(panel).getByRole("heading", { level: 2, name: "Metadata" });
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

    // Share links open a new tab and say so.
    const share = within(panel).getByRole("link", { name: "LinkedIn (opens in a new tab)" });
    expect(share).toHaveAttribute("target", "_blank");
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
    expect(Number.parseFloat(getComputedStyle(prose).maxWidth)).toBe(640);
    const paragraph = prose.querySelector("p");
    if (paragraph == null) throw new Error("Article paragraph is missing");
    expect(getComputedStyle(paragraph).fontSize).toBe("17px");
    const heading = prose.querySelector("h2");
    if (heading == null) throw new Error("Article heading is missing");
    expect(Number.parseFloat(getComputedStyle(heading).fontSize)).toBeGreaterThan(17);
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
