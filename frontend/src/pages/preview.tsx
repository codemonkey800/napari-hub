import axios from 'axios';
import https from 'https';
import { GetStaticPropsResult } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { PluginDetails } from '@/components';
import { PageMetadata } from '@/components/common';
import { PluginStateProvider } from '@/context/plugin';
import { PluginData, PluginRepoData } from '@/types';
import { fetchRepoData } from '@/utils';

const API_URL = 'https://api.napari-hub.org';

interface Props {
  plugin: PluginData;
  repo?: PluginRepoData;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const name = process.env.PREVIEW_PLUGIN;

  if (!name) {
    throw new Error('Plugin not provided');
  }

  const url = `${API_URL}/plugins/${name}`;

  const { data: plugin } = await axios.get<PluginData>(url, {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
  const repo = await fetchRepoData(plugin.code_repository);

  return {
    props: {
      plugin,
      repo,
    },
  };
}

export default function Preview({ plugin, repo }: Props) {
  const router = useRouter();

  const keywords: string[] = [];
  let title = 'napari hub | plugins';
  if (plugin?.name && plugin?.authors) {
    title = `${title} | ${plugin.name}`;

    const authors = plugin.authors.map(({ name }) => name).join(', ');
    if (authors) {
      title = `${title} by ${authors}`;
    }

    keywords.push(plugin.name, ...plugin.authors.map(({ name }) => name));
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <PageMetadata
          keywords={keywords}
          description={plugin?.summary}
          pathname={router.pathname}
        />
      </Head>

      <PluginStateProvider
        plugin={plugin}
        repo={repo ?? { forks: 0, issuesAndPRs: 0, stars: 0 }}
      >
        <PluginDetails />
      </PluginStateProvider>
    </>
  );
}
