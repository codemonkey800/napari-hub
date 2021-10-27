import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';

import { Divider } from '@/components/common/Divider';
import { MediaFragment } from '@/components/common/media';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { MetadataList, MetadataListTextItem } from '@/components/MetadataList';
import { usePluginMetadata, usePluginState } from '@/context/plugin';

interface GithubMetadataItem {
  title: string;
  count: number;
}

/**
 * Component for rendering plugin GitHub data.
 *
 * TODO Replace this with actual GitHub data.
 */
function PluginGithubData() {
  const { repo, repoFetchError } = usePluginState();
  const items: GithubMetadataItem[] = [
    {
      title: 'Stars',
      count: repo.stars,
    },
    {
      title: 'Forks',
      count: repo.forks,
    },
    {
      title: 'Issues + PRs',
      count: repo.issuesAndPRs,
    },
  ];
  const error =
    repoFetchError &&
    `We're having trouble loading the GitHub stats: ${repoFetchError.status}`;

  return (
    <MetadataList title="GitHub activity" compact>
      {error ? (
        <li>
          <p className="text-napari-error mt-2">{error}</p>
        </li>
      ) : (
        items.map((item) => (
          <MetadataListTextItem key={item.title}>
            {item.title}: <span className="font-bold">{item.count}</span>
          </MetadataListTextItem>
        ))
      )}
    </MetadataList>
  );
}

interface CommonProps {
  /**
   * Class name to pass to root element.
   */
  className?: string;
}

interface PluginMetadataBaseProps extends CommonProps {
  divider: ReactNode;
  inline?: boolean;
}

/**
 * Component for rendering plugin metadata responsively.  This handles
 * rendering the divider for vertical layouts and rendering headers / values
 * inline for smaller screens.
 */
function PluginMetadataBase({
  className,
  divider,
  inline,
}: PluginMetadataBaseProps) {
  const metadata = usePluginMetadata();

  function renderSingleItemList(title: string, value: string) {
    return (
      <MetadataList inline={inline} title={title} empty={!value}>
        <MetadataListTextItem>{value}</MetadataListTextItem>
      </MetadataList>
    );
  }

  function renderItemList(title: string, values: string[]) {
    return (
      <MetadataList inline={inline} title={title} empty={isEmpty(values)}>
        {values.map((value) => (
          <MetadataListTextItem key={value}>{value}</MetadataListTextItem>
        ))}
      </MetadataList>
    );
  }

  const projectMetadata = (
    <SkeletonLoader
      className="h-56"
      render={() => (
        <>
          {/* Version */}
          {renderSingleItemList(metadata.version.name, metadata.version.value)}

          {/* Release date */}
          {renderSingleItemList(
            metadata.releaseDate.name,
            metadata.releaseDate.value,
          )}

          {/* First released */}
          {renderSingleItemList(
            metadata.firstReleased.name,
            metadata.firstReleased.value,
          )}

          {/* Development status */}
          {renderItemList(
            metadata.developmentStatus.name,
            metadata.developmentStatus.values,
          )}

          {/* License */}
          {renderSingleItemList(metadata.license.name, metadata.license.value)}
        </>
      )}
    />
  );

  const requirementMetadata = (
    <SkeletonLoader
      className="h-56"
      render={() => (
        <>
          {/* Python version */}
          {renderSingleItemList(
            metadata.pythonVersion.name,
            metadata.pythonVersion.value,
          )}

          {/* Operating systems */}
          {renderItemList(
            metadata.operatingSystems.name,
            metadata.operatingSystems.values,
          )}

          {/* Requirements */}
          {renderItemList(
            metadata.requirements.name,
            metadata.requirements.values,
          )}
        </>
      )}
    />
  );

  return (
    <div
      // ID is used to navigate to metadata using `View project data` link
      id="pluginMetadata"
      className={clsx(
        className,

        // Vertical 1-column grid layout for < xl
        'grid',

        // Horizontal layout with 3-column grid for xl+
        'screen-875:grid-cols-3',

        // Back to 1-column vertical layout for 3xl+
        'screen-1425:grid-cols-1',

        'space-y-6',
      )}
    >
      <div className="space-y-6">{projectMetadata}</div>

      {divider}

      <SkeletonLoader
        className={clsx(
          'h-40',
          'screen-875:mx-6 screen-875:h-full',
          'screen-1425:mx-0 screen-1425:h-40',
        )}
        render={() => <PluginGithubData />}
      />

      {divider}

      <div className="space-y-6">{requirementMetadata}</div>
    </div>
  );
}

/**
 * Component for rendering plugin metadata responsively.  This handles
 * rendering the divider for vertical layouts and rendering headers / values
 * inline for smaller screens.
 */
export function PluginMetadata(props: CommonProps) {
  let divider = <Divider className="my-6" />;
  divider = (
    <>
      <MediaFragment greaterThanOrEqual="3xl">{divider}</MediaFragment>
      <MediaFragment lessThan="xl">{divider}</MediaFragment>
    </>
  );

  return (
    <>
      <MediaFragment lessThan="3xl">
        <PluginMetadataBase {...props} divider={divider} inline />
      </MediaFragment>

      <MediaFragment greaterThanOrEqual="3xl">
        <PluginMetadataBase {...props} divider={divider} />
      </MediaFragment>
    </>
  );
}
