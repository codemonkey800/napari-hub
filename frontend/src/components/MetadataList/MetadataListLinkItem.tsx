import clsx from 'clsx';
import { ReactNode } from 'react-markdown';

import { Link } from '@/components/common/Link/Link';
import { usePluginState } from '@/context/plugin';
import { usePlausible } from '@/hooks';

interface Props {
  children: string;
  href: string;
  icon?: ReactNode;
  missingIcon?: ReactNode;
}

export function MetadataListLinkItem({
  children,
  href,
  icon,
  missingIcon,
}: Props) {
  const plausible = usePlausible();
  const { plugin } = usePluginState();

  const itemClassName = 'ml-2 -mt-1';

  return (
    <li className="flex">
      <span className="min-w-4">{href ? icon : missingIcon || icon}</span>

      {href ? (
        <Link
          className={clsx(itemClassName, 'underline')}
          href={href}
          newTab
          onClick={() => {
            const url = new URL(href);

            if (plugin?.name) {
              plausible('Links', {
                host: url.host,
                link: children,
                plugin: plugin.name,
                url: href,
              });
            }
          }}
        >
          {children}
        </Link>
      ) : (
        <span className={itemClassName}>{children}</span>
      )}
    </li>
  );
}
