// src/components/Section.tsx
import React, { forwardRef } from "react";

type As = React.ElementType;

type Props<T extends As = "section"> = {
  id?: string;
  className?: string;
  as?: T;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "id" | "children">;

function SectionInner<T extends As = "section">(
  { id, className = "", as, children, ...rest }: Props<T>,
  ref: React.Ref<Element>
) {
  const Tag = (as || "section") as As;
  return (
    <Tag
      ref={ref as any}
      id={id}
      className={`w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...(rest as any)}
    >
      {children}
    </Tag>
  );
}

const Section = forwardRef(SectionInner) as <T extends As = "section">(
  p: Props<T> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default Section;
