// @thewhatmatters/wmds@0.4.41 · Pattern — basic table
// Storybook: Components/Table → Pattern — basic table (?path=/story/components-table--basic)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@thewhatmatters/wmds";

export interface PostRow {
  id: string;
  title: string;
  author: string;
  status: "success" | "warning" | "idle";
  statusLabel: string;
  words: string;
}

export function RecentPosts({ posts, total }: { posts: PostRow[]; total: string }) {
  return (
    <Table aria-label="Recent posts">
      <TableCaption>Posts from the last 30 days</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Post</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">Words</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>
              <Badge status={post.status} dot={post.status !== "idle"}>
                {post.statusLabel}
              </Badge>
            </TableCell>
            <TableCell align="end">{post.words}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell align="end">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
