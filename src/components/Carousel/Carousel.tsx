import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { IconButton } from "../IconButton/IconButton";

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  /** Controlled slide index. Pair with `onIndexChange`. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  children: ReactNode;
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CarouselSlide({ className, children, ...props }: CarouselSlideProps) {
  return (
    <div
      className={cn("text-[12.5px] leading-[1.625] text-pretty text-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function slidesFromChildren(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement[];
}

function CarouselRoot({
  title,
  index,
  defaultIndex = 0,
  onIndexChange,
  children,
  className,
  ...props
}: CarouselProps) {
  const labelId = useId();
  const slides = slidesFromChildren(children);
  const count = slides.length;
  const isControlled = index !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultIndex);
  const raw = isControlled ? index : uncontrolled;
  const current = count === 0 ? 0 : Math.min(Math.max(raw, 0), count - 1);

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      const clamped = Math.min(Math.max(next, 0), count - 1);
      if (clamped === current) return;
      if (!isControlled) setUncontrolled(clamped);
      onIndexChange?.(clamped);
    },
    [count, current, isControlled, onIndexChange],
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      className={cn("flex w-full flex-col items-start", className)}
      {...props}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <h2 id={labelId} className="text-[13px] font-semibold leading-[1.5] text-fg">
            {title}
          </h2>
          <span className="text-[13px] leading-[1.5] tabular-nums text-muted">{count}</span>
        </div>
        <div className="flex items-center gap-[2px]">
          <IconButton
            label="Previous slide"
            variant="ghost"
            size="xs"
            className="size-6"
            disabled={current <= 0 || count === 0}
            icon={<ChevronLeft strokeWidth={2.2} />}
            onClick={() => go(current - 1)}
          />
          <IconButton
            label="Next slide"
            variant="ghost"
            size="xs"
            className="size-6"
            disabled={current >= count - 1 || count === 0}
            icon={<ChevronRight strokeWidth={2.2} />}
            onClick={() => go(current + 1)}
          />
        </div>
      </div>
      <div className="mt-1.5 w-full" aria-live="polite">
        {slides[current] ?? null}
      </div>
    </section>
  );
}

/**
 * Title + count + prev/next. No autoplay. Compose slide copy with Badge / StatusDot / mono figures.
 */
export const Carousel = Object.assign(CarouselRoot, {
  Slide: CarouselSlide,
});
