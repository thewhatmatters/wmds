import type { ChartCartesianPoint } from "../../components/organisms/Chart/Chart";
import type { ChartRankedBarItem } from "../../components/organisms/Chart/ChartRankedBars";

export interface PitchKitPost {
  id: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
  saves: number;
  reach: number;
  likes: number;
  comments: number;
}

const dailyReach = [
  6800, 7200, 7100, 7600, 8100, 7800, 8200, 8300, 8700, 9000,
  8400, 7900, 8200, 8000, 8500, 9800, 9500, 10200, 10400, 11200,
  11900, 17600, 12400, 11600, 12100, 12800, 13200, 14100, 14800, 15300,
];

export const pitchKitReachData: ChartCartesianPoint[] = dailyReach.map(
  (reach, index) => ({
    date: new Date(2026, 7, 9 + index),
    typical: 9300,
    reach,
  }),
);

export const pitchKitAudience = {
  countries: [
    { label: "United States", value: 42 },
    { label: "United Kingdom", value: 16 },
    { label: "Canada", value: 11 },
    { label: "Australia", value: 8 },
  ] satisfies ChartRankedBarItem[],
  cities: [
    { label: "New York", value: 12 },
    { label: "Los Angeles", value: 9 },
    { label: "London", value: 7 },
  ] satisfies ChartRankedBarItem[],
  ages: [
    { label: "25–34", value: 44 },
    { label: "18–24", value: 28 },
    { label: "35–44", value: 17 },
  ] satisfies ChartRankedBarItem[],
  gender: [
    { label: "Women", value: 68 },
    { label: "Men", value: 30 },
    { label: "Not specified", value: 2 },
  ] satisfies ChartRankedBarItem[],
} as const;

export const pitchKitPosts: PitchKitPost[] = [
  {
    id: "coastal-table",
    publishedAt: "Sep 5",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Bright kitchen with a coastal dining table",
    saves: 1240,
    reach: 48200,
    likes: 3910,
    comments: 182,
  },
  {
    id: "morning-studio",
    publishedAt: "Sep 2",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Sunlit modern studio interior",
    saves: 980,
    reach: 41600,
    likes: 3420,
    comments: 740,
  },
  {
    id: "market-flowers",
    publishedAt: "Aug 28",
    imageUrl:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Colorful flowers at an outdoor market",
    saves: 810,
    reach: 38900,
    likes: 3180,
    comments: 310,
  },
  {
    id: "linen-details",
    publishedAt: "Aug 24",
    imageUrl:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Neutral linen and interior details",
    saves: 740,
    reach: 35100,
    likes: 2860,
    comments: 880,
  },
  {
    id: "summer-table",
    publishedAt: "Aug 20",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Warm summer table setting",
    saves: 690,
    reach: 33700,
    likes: 2710,
    comments: 225,
  },
  {
    id: "city-walk",
    publishedAt: "Aug 16",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Creator walking through a bright city street",
    saves: 620,
    reach: 30900,
    likes: 2490,
    comments: 910,
  },
];
