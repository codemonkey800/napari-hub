import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function MetadataListTextItem({ children, className }: Props) {
  return <li className={className}>{children}</li>;
}
