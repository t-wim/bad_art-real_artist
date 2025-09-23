import React, { forwardRef } from "react";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

const Section = forwardRef<HTMLElement, SectionProps>(function SectionInner(
  { id, className = "", children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={`w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
});

export default Section;
