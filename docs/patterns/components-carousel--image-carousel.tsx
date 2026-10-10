// @thewhatmatters/wmds@0.4.8 · Pattern — image carousel
// Storybook: Components/Carousel → Pattern — image carousel (?path=/story/components-carousel--image-carousel)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import { Card, Carousel, cardLayoutBodyOccupantRadiusClasses } from "@thewhatmatters/wmds";

export interface CarouselImage {
  src: string;
  alt: string;
}

export function ImageCarousel({ label, images }: { label: string; images: CarouselImage[] }) {
  return (
    <Carousel aria-label={label}>
      {images.map((image) => (
        <Carousel.Item key={image.src}>
          <Card variant="outlined" shape="rounded">
            <Card.Body>
              <img
                className={`aspect-[4/3] w-full object-cover ${cardLayoutBodyOccupantRadiusClasses}`}
                src={image.src}
                alt={image.alt}
              />
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
