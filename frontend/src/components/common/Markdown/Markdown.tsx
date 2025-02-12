import clsx from 'clsx';
import ReactMarkdown, { PluggableList, TransformOptions } from 'react-markdown';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import slug from 'rehype-slug';
import externalLinks from 'remark-external-links';
import gfm from 'remark-gfm';
import removeComments from 'remark-remove-comments';

import styles from './Markdown.module.scss';
import { MarkdownCode } from './MarkdownCode';
import { MarkdownParagraph } from './MarkdownParagraph';
import { MarkdownTOC } from './MarkdownTOC';

interface Props {
  // Optional CSS class for markdown component.
  className?: string;

  // Markdown code.
  children: string;

  // Disable H1 headers when rendering markdown.
  disableHeader?: boolean;
}

const REMARK_PLUGINS: PluggableList = [
  // Add support for GitHub style markdown like checkboxes.
  gfm,

  // Remove HTML comments from markdown.
  removeComments,

  [externalLinks, { target: '_blank', rel: 'noreferrer' }],
];

const REHYPE_PLUGINS: PluggableList = [
  // Parse inner HTML
  raw,

  // Sanitize inner HTML
  sanitize,

  // Add slug IDs to every heading.
  slug,
];

/**
 * Component for rendering Markdown consistently in napari hub.
 */
export function Markdown({ className, children, disableHeader }: Props) {
  const components: TransformOptions['components'] = {
    code: MarkdownCode,
    p: MarkdownParagraph,
  };

  if (disableHeader) {
    components.h1 = () => null;
  }

  return (
    <ReactMarkdown
      className={clsx(
        className,
        styles.markdown,

        /*
          Use Tailwind prose for reasonable defaults on markdown styling. In
          the future, we can fine tune the CSS by hand for each markdown
          element.
        */
        'prose',

        // Disable max-width set by prose
        'max-w-none',
      )}
      components={components}
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
    >
      {children}
    </ReactMarkdown>
  );
}

Markdown.TOC = MarkdownTOC;
