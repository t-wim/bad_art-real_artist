import React, { forwardRef } from "react";

type AsProp = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;
type Props<T extends AsProp> = {
  id?: string;
  className?: string;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "id">;

function SectionInner<T extends AsProp = "section">(
  { id, className = "", as, children, ...rest }: Props<T>,
  ref: React.ForwardedRef<Element>
) {
  const Tag = (as || "section") as any;
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

const Section = forwardRef(SectionInner) as <T extends AsProp = "section">(
  p: Props<T> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default Section;
