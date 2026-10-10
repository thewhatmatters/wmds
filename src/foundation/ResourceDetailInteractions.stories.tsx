import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ResourceDetailOverGrid, ResourceDetailStandalone } from "../guides/ResourceDetail/ResourceDetailExample";

/**
 * Browser interaction tests for **Guides/Resource detail → Pattern — resource detail** — run via
 * `npm run test:interactions`.
 */
const meta = {
  title: "Internal/Interactions/Resource detail",
  tags: ["test", "!dev", "!autodocs"],
  parameters: {
    docs: { disable: true },
    wmdsLayout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const body = () => within(document.body);

export const OpensFromTileAndReturnsFocus: Story = {
  name: "a tile opens the detail over the grid; Escape closes it and focus returns to the tile",
  render: () => <ResourceDetailOverGrid />,
  play: async ({ canvasElement }) => {
    const tile = within(canvasElement).getByRole("link", { name: /^Contrast checker/ });
    expect(tile).not.toHaveAttribute("target");
    tile.focus();
    await userEvent.keyboard("{Enter}");

    const dialog = await waitFor(() => body().getByRole("dialog", { name: "Contrast checker" }));
    expect(dialog).toHaveAttribute("aria-modal", "true");
    // The grid stays behind it and does not scroll.
    expect(within(canvasElement).getByRole("list", { name: "Library" })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    expect(within(dialog).getByText("3 of 9")).toBeInTheDocument();
    expect(within(dialog).getByRole("heading", { level: 2, name: "Contrast checker" })).toBeInTheDocument();
    const visit = within(dialog).getByRole("link", { name: "Visit contrast.example (opens in a new tab)" });
    expect(visit).toHaveAttribute("href", "https://contrast.example");
    expect(visit).toHaveAttribute("target", "_blank");
    expect(within(dialog).getByText("Source")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(body().queryByRole("dialog")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(tile);
    });
    expect(document.body.style.overflow).not.toBe("hidden");
  },
};

export const MovesBetweenResources: Story = {
  name: "previous and next, and Left and Right, move between resources; the ends are off",
  render: () => <ResourceDetailOverGrid startAt="grid-notes" />,
  play: async () => {
    const dialog = await waitFor(() => body().getByRole("dialog", { name: "Grid notes" }));
    const previous = within(dialog).getByRole("button", { name: "Previous resource" });
    const next = within(dialog).getByRole("button", { name: "Next resource" });
    // The first resource has nothing before it.
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();

    await userEvent.click(next);
    await waitFor(() => {
      expect(body().getByRole("dialog", { name: "Type scale" })).toBeInTheDocument();
    });
    // The second resource is a video, with controls, that does not play by itself.
    const video = dialog.querySelector("video");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
    expect(previous).toBeEnabled();

    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(body().getByRole("dialog", { name: "Contrast checker" })).toBeInTheDocument();
    });
    expect(within(dialog).getByText("3 of 9")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    await waitFor(() => {
      expect(body().getByRole("dialog", { name: "Grid notes" })).toBeInTheDocument();
    });
    // Left on the first does nothing.
    await userEvent.keyboard("{ArrowLeft}");
    expect(body().getByRole("dialog", { name: "Grid notes" })).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole("button", { name: "Close dialog" }));
    await waitFor(() => {
      expect(body().queryByRole("dialog")).toBeNull();
    });
  },
};

export const LastResource: Story = {
  name: "next is off on the last resource",
  render: () => <ResourceDetailOverGrid startAt="landing-archive" />,
  play: async () => {
    const dialog = await waitFor(() => body().getByRole("dialog", { name: "Landing page archive" }));
    expect(within(dialog).getByRole("button", { name: "Next resource" })).toBeDisabled();
    expect(within(dialog).getByRole("button", { name: "Previous resource" })).toBeEnabled();
    expect(within(dialog).getByText("9 of 9")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(body().queryByRole("dialog")).toBeNull();
    });
  },
};

export const PageForm: Story = {
  name: "the page form has the same content under a breadcrumb, and no dialog",
  render: () => <ResourceDetailStandalone id="contrast" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(body().queryByRole("dialog")).toBeNull();
    expect(canvas.getByRole("heading", { level: 1, name: "Contrast checker" })).toBeInTheDocument();
    const path = canvas.getByRole("navigation");
    expect(within(path).getByRole("link", { name: "Resources" })).toBeInTheDocument();
    expect(within(path).getByText("Contrast checker")).toHaveAttribute("aria-current", "page");
    expect(canvas.getByRole("link", { name: "Visit contrast.example (opens in a new tab)" })).toBeInTheDocument();
    expect(canvas.getByText("Made by")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Next resource" })).toBeNull();
  },
};
