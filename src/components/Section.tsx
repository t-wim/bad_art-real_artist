// src/components/Section.tsx
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
} from "react";

type As = ElementType;

type SectionProps<T extends As = "section"> = {
  id?: string;
  className?: string;
  as?: T;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "id" | "children">;

function SectionInner<T extends As = "section">(
  { id, className = "", as, children, ...rest }: SectionProps<T>,
  ref: ForwardedRef<ElementRef<T>>
) {
  const Tag = (as ?? "section") as T;
  return (
    <Tag
      ref={ref}
      id={id}
      className={`w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const Section = forwardRef(SectionInner) as <T extends As = "section">(
  props: SectionProps<T> & { ref?: ForwardedRef<ElementRef<T>> }
) => ReactElement | null;

export default Section;
