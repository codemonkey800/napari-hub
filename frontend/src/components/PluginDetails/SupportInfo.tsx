import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { ReactNode } from 'react';

import {
  GitHub,
  ProjectDocumentation,
  ProjectIssues,
  ProjectSite,
  ProjectSupport,
  Twitter,
} from '@/components/common/icons';
import { Link } from '@/components/common/Link';
import { Media } from '@/components/common/media';
import {
  MetadataList,
  MetadataListLinkItem,
  MetadataListTextItem,
} from '@/components/MetadataList';
import { usePluginMetadata, usePluginState } from '@/context/plugin';

import styles from './SupportInfo.module.scss';

/**
 * Extracts a Twitter's username from the given Twitter URL.  Regex copied
 * from: https://stackoverflow.com/a/5948248
 *
 * @param url Twitter URL
 * @returns Username from Twitter URL, or empty string if not found
 */
function formatTwitter(url: string): string {
  const match =
    /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?(?<name>[^/]+)(\/\w+)*$/.exec(
      url,
    );

  if (match) {
    return `@${String(match.groups?.name)}`;
  }

  return '';
}

interface CommonProps {
  /**
   * Class name to pass to root element.
   */
  className?: string;
}

interface MetadataLinkItem {
  text: string;
  href: string;
  icon?: ReactNode;
  missingIcon?: ReactNode;
}

interface SupportInfoBaseProps extends CommonProps {
  /**
   * Render the support info metadata list items inline.
   */
  inline?: boolean;
}

export function SupportInfoBase({ className }: SupportInfoBaseProps) {
  const metadata = usePluginMetadata();

  const learnMoreItems: MetadataLinkItem[] = [];

  if (metadata.projectSite.href) {
    learnMoreItems.push({
      text: metadata.projectSite.name,
      href: metadata.projectSite.href,
      icon: <ProjectSite />,
    });
  }

  learnMoreItems.push(
    {
      text: metadata.documentationSite.name,
      href: metadata.documentationSite.href,
      icon: <ProjectDocumentation />,
      missingIcon: (
        <ProjectDocumentation className={styles.missingDocumentation} />
      ),
    },
    {
      text: metadata.supportSite.name,
      href: metadata.supportSite.href,
      icon: <ProjectSupport />,
      missingIcon: <ProjectSupport className={styles.missingProjectSupport} />,
    },
    {
      text: metadata.reportIssues.name,
      href: metadata.reportIssues.href,
      icon: <ProjectIssues />,
      missingIcon: <ProjectIssues className={styles.missingProjectIssues} />,
    },
  );

  if (metadata.twitter.href) {
    learnMoreItems.push({
      text: formatTwitter(metadata.twitter.href),
      href: metadata.twitter.href,
      icon: <Twitter />,
    });
  }

  return (
    <div
      className={clsx('grid grid-cols-3 text-black bg-gray-100 p-5', className)}
    >
      <MetadataList
        title={metadata.authors.name}
        empty={isEmpty(metadata.authors.values)}
      >
        {metadata.authors.values.map((author) => (
          <MetadataListTextItem key={author}>{author}</MetadataListTextItem>
        ))}
      </MetadataList>

      <MetadataList title="Learn more">
        {learnMoreItems.map(({ text, ...linkProps }) => (
          <MetadataListLinkItem key={linkProps.href} {...linkProps}>
            {text}
          </MetadataListLinkItem>
        ))}
      </MetadataList>

      <MetadataList
        title={metadata.sourceCode.name}
        empty={!metadata.sourceCode.href}
      >
        {metadata.sourceCode.href && (
          <MetadataListLinkItem
            href={metadata.sourceCode.href}
            icon={<GitHub />}
            missingIcon={<GitHub className={styles.missingGithub} />}
          >
            {metadata.name.value}
          </MetadataListLinkItem>
        )}
      </MetadataList>
    </div>
  );
}

/**
 * Component for rendering SupportInfoBase responsively.  This includes
 * rendering the metadata list horizontally for xl+ layouts and inline for
 * smaller layouts.
 */
export function SupportInfo(props: CommonProps) {
  return (
    <>
      <Media greaterThanOrEqual="xl">
        <SupportInfoBase {...props} />
      </Media>

      <Media lessThan="xl">
        <SupportInfoBase {...props} inline />
      </Media>
    </>
  );
}
