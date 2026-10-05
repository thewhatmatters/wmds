// @thewhatmatters/wmds@0.4.5 · Pattern — distribution strip
// Storybook: Components/Chart → Pattern — distribution strip (?path=/story/components-chart--post-reach-distribution)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Chart } from "@thewhatmatters/wmds";

export function PostReachDistribution({ posts }: { posts: { id: string; reach: number }[] }) {
  return (
    <Chart.DistributionStrip
      aria-label="Reach distribution for six recent posts"
      items={posts.map((post, index) => ({
        id: post.id,
        label: `#${index + 1}`,
        value: post.reach,
      }))}
      metricLabel="Reach"
      reference={{ value: 9300, label: "Typical 9.3K" }}
      minHeight={240}
    />
  );
}
