// src/components/Section.tsx
import { forwardRef } from "react";

type As = React.ElementType;

type SectionProps<T extends As = "section"> = {
  id?: string;
  className?: string;
  as?: T;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "id" | "children">;

type SectionRef<T extends As> = React.ComponentPropsWithRef<T>["ref"];

function SectionInner<T extends As = "section">(
  { id, className = "", as, children, ...rest }: SectionProps<T>,
  ref: SectionRef<T>
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
  props: SectionProps<T> & { ref?: SectionRef<T> }
) => React.ReactElement | null;

export default Section;
