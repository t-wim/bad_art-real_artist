// src/components/Section.tsx
import React, { forwardRef } from "react";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  className?: string;
  as?: React.ElementType;
  children?: React.ReactNode;
};

const Section = forwardRef<HTMLElement, SectionProps>(function SectionInner(
  { id, className = "", as = "section", children, ...rest },
  ref,
) {
  const Tag = as;
  return React.createElement(
    Tag,
    {
      ref,
      id,
      className: `w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 ${className}`,
      ...rest,
    },
    children,
  );
});

export default Section;
