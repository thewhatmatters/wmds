// @thewhatmatters/wmds@0.4.55 · Pattern — review card
// Storybook: Components/Testimonial → Pattern — review card (?path=/story/components-testimonial--review)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Testimonial } from "@thewhatmatters/wmds";

export interface Review {
  quote: string;
  name: string;
  /** Their town, or their role. */
  detail?: string;
  /** Stars out of five, when the review had them. */
  rating?: number;
  /** Where it was published: "Google review". */
  source?: string;
}

export function ReviewCard({ quote, name, detail, rating, source }: Review) {
  return <Testimonial quote={quote} name={name} detail={detail} rating={rating} source={source} />;
}

/** Three reviews side by side; one column on phones. The names line up along the bottom. */
export function ReviewRow({ reviews }: { reviews: Review[] }) {
  return (
    <ul role="list" className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
      {reviews.map((review) => (
        <li key={review.name} className="flex">
          <ReviewCard {...review} />
        </li>
      ))}
    </ul>
  );
}
