import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  type ReactElement,
} from "react";

type AsProp = ElementType;

type SectionProps<T extends AsProp> = {
  id?: string;
  className?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "id">;

function SectionInner<T extends AsProp = "section">(
  { id, className = "", as, children, ...rest }: SectionProps<T>,
  ref: ForwardedRef<HTMLElement>
) {
  const Tag = (as ?? "section") as AsProp;
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
  props: SectionProps<T> & { ref?: ForwardedRef<HTMLElement> }
) => ReactElement | null;

export default Section;
