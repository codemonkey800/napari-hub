import { Tooltip } from '@material-ui/core';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { MetadataStatus } from '@/components/MetadataStatus';

import styles from './MetadataList.module.scss';

interface Props {
  children: ReactNode;
  title: string;
  inline?: boolean;
  compact?: boolean;
  empty?: boolean;
}

/**
 * Component for rendering a list of plugin metadata titles and values.
 */
export function MetadataList({
  children,
  compact,
  empty,
  title,
  inline,
}: Props) {
  function renderEmptyList() {
    return (
      <li
        // Preview orange overlay if isValueEmpty is true
        className={clsx(
          'text-napari-gray font-normal flex justify-between items-center',
          inline ? 'inline' : 'block leading-8',
        )}
      >
        <span>information not submitted</span>

        <Tooltip placement="right" title="MetadataStatus Text Placeholder">
          <div>
            <MetadataStatus hasValue={false} />
          </div>
        </Tooltip>
      </li>
    );
  }

  return (
    <div className="text-sm">
      <div
        className={clsx(
          empty && 'bg-napari-preview-orange-overlay',
          inline && 'space-x-2',
          'space-y-2',
        )}
      >
        <h4
          className={clsx(
            // Font
            'font-bold whitespace-nowrap',
            inline && 'inline',
          )}
        >
          {title}:
        </h4>

        <ul
          className={clsx(
            styles.list,
            'list-none text-sm leading-normal',
            compact ? 'space-y-2' : 'space-y-5',
            inline && ['inline', styles.inline],
          )}
        >
          {empty ? renderEmptyList() : children}
        </ul>
      </div>
    </div>
  );
}
