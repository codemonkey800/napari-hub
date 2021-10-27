import { isArray } from 'lodash';
import { createContext, ReactNode, useContext } from 'react';
import { DeepPartial } from 'utility-types';

import { EMPTY_BODY_TEXT } from '@/constants/plugin';
import { PluginData, PluginRepoData, PluginRepoFetchError } from '@/types';
import { formatDate } from '@/utils';

/**
 * Shared state for plugin data.
 */
interface PluginState {
  plugin?: DeepPartial<PluginData>;
  repo: PluginRepoData;
  repoFetchError?: PluginRepoFetchError;
}

const PluginStateContext = createContext<PluginState | null>(null);

interface Props extends PluginState {
  children: ReactNode;
}

/**
 * Provider for plugin state.  This allows child components to access the
 * plugin state directly from context so that we don't have to pass the
 * `plugin` prop around everywhere.
 */
export function PluginStateProvider({ children, ...props }: Props) {
  return (
    <PluginStateContext.Provider value={props}>
      {children}
    </PluginStateContext.Provider>
  );
}

/**
 * Hook for accessing the plugin state context.  This allows components to
 * access the plugin data from anywhere.
 *
 * @returns The plugin state
 */
export function usePluginState(): PluginState {
  const context = useContext(PluginStateContext);

  if (!context) {
    throw new Error('usePluginState must be used in a PluginStateProvider');
  }

  return context;
}

export function usePluginMetadata() {
  const { plugin } = usePluginState();

  return {
    name: {
      name: 'Plugin name',
      value: plugin?.name ?? 'Plugin name',
    },

    summary: {
      name: 'Brief description',
      value: plugin?.name ?? 'Brief description',
    },

    description: {
      name: 'Plugin description using hub-specific template',
      // Return placeholder text if value is null, undefined, or empty string.
      value: plugin?.name || EMPTY_BODY_TEXT,
    },

    releaseDate: {
      name: 'Release date',
      value: plugin?.release_date ? formatDate(plugin.release_date) : '',
    },

    firstReleased: {
      name: 'First released',
      value: plugin?.first_released ? formatDate(plugin.first_released) : '',
    },

    authors: {
      name: 'Authors',
      values:
        plugin?.authors && isArray(plugin.authors)
          ? plugin.authors
              ?.map((author) => author.name)
              .filter((name): name is string => !!name)
          : [],
    },

    projectSite: {
      name: 'Project site',
      href: plugin?.project_site ?? '',
    },

    reportIssues: {
      name: 'Report issues',
      previewName: 'Report issues site',
      href: plugin?.report_issues ?? '',
    },

    twitter: {
      name: 'Twitter',
      previewName: 'Twitter handle',
      href: plugin?.twitter ?? '',
    },

    sourceCode: {
      name: 'Source code',
      href: plugin?.code_repository ?? '',
    },

    supportSite: {
      name: 'Support site',
      href: plugin?.support ?? '',
    },

    documentationSite: {
      name: 'Documentation',
      previewName: 'Documentation site',
      href: plugin?.documentation ?? '',
    },

    version: {
      name: 'Version',
      value: plugin?.version ?? '',
    },

    developmentStatus: {
      name: 'Development status',
      values:
        plugin?.development_status && isArray(plugin.development_status)
          ? plugin.development_status
              ?.map(
                (status) => status?.replace('Development Status :: ', '') ?? '',
              )
              .filter((value): value is string => !!value)
          : [],
    },

    license: {
      name: 'License',
      value: plugin?.license ?? '',
    },

    pythonVersion: {
      name: 'Python versions supported',
      value: plugin?.python_version ?? '',
    },

    operatingSystems: {
      name: 'Operating system',
      values:
        plugin?.operating_system && isArray(plugin.operating_system)
          ? plugin.operating_system
              .map((operatingSystem) =>
                operatingSystem?.replace('Operating System :: ', ''),
              )
              .filter((value): value is string => !!value)
          : [],
    },

    requirements: {
      name: 'Requirements',
      values:
        plugin?.requirements && isArray(plugin.requirements)
          ? plugin.requirements.filter(
              (req): req is string => !req?.includes('; extra == '),
            )
          : [],
    },
  };
}
