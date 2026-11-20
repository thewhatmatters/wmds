// @thewhatmatters/wmds@0.4.54 · Pattern — menu section
// Storybook: Components/PriceList → Pattern — menu section (?path=/story/components-pricelist--menu)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { PriceList } from "@thewhatmatters/wmds";

export interface MenuDish {
  name: string;
  /** What's in it. */
  note?: string;
  /** As written on the menu: "$18", "Market price". */
  price: string;
}

export interface MenuSectionProps {
  /** Unique on the page: it links the list to its heading. */
  id: string;
  title: string;
  dishes: MenuDish[];
}

export function MenuSection({ id, title, dishes }: MenuSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 id={id} className="type-heading-2 text-fg">
        {title}
      </h2>
      <PriceList size="lg" aria-labelledby={id}>
        {dishes.map((dish) => (
          <PriceList.Item key={dish.name} name={dish.name} note={dish.note} price={dish.price} />
        ))}
      </PriceList>
    </section>
  );
}
