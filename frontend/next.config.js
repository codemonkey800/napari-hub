const mdx = require('@next/mdx');
const slug = require('remark-slug');
const html = require('rehype-stringify');
const externalLinks = require('remark-external-links');
const { EnvironmentPlugin } = require('webpack');

const linkvars = require('./src/utils/linkvars');
const { LINKS } = require('./src/constants');

const withMDX = mdx({
  extensions: /\.mdx$/,
  options: {
    remarkPlugins: [
      slug,
      html,
      [externalLinks, { target: '_blank', rel: 'noreferrer' }],
      [linkvars, { vars: LINKS }],
    ],
  },
});

const isPreview = !!process.env.PREVIEW_PLUGIN;

const previewOptions = isPreview
  ? {
      // The Image API doesn't work for exported apps, so we need to use a
      // different image loader to supplement it. The workaround is to use imgix
      // with a root path for Next.js v10: https://git.io/J0k6G. For v11, a new
      // `custom` loader was added to support this behavior directly:
      // https://git.io/J0k6R
      // TODO Refactor to use `custom` loader when Next.js is upgraded to v11
      images: {
        loader: 'imgix',
        path: '/',
      },

      // Override default pages being exported to be only the preview page:
      // https://stackoverflow.com/a/64071979
      exportPathMap() {
        return {
          '/preview': { page: '/preview' },
        };
      },
    }
  : {};

module.exports = withMDX({
  ...previewOptions,

  pageExtensions: ['ts', 'tsx', 'mdx'],

  // Enable webpack 5 support for faster builds :)
  // https://nextjs.org/docs/messages/webpack5
  future: {
    webpack5: true,
  },

  webpack(config, { isServer }) {
    // Sets BABEL_ENV to `client` or `server` depending on the Next.js build.
    // This is required for the Material UI + babel import plugin to work.
    process.env.BABEL_ENV = config.name;

    if (!isServer) {
      config.resolve.alias.lodash = require.resolve('lodash-es');
    }

    config.plugins.push(
      new EnvironmentPlugin({
        // Environment variable for current deployment environment (possible
        // values are local, dev, staging, and prod) If an `ENV` variable is not
        // defined, the value `local` is used by default (for example when
        // running `yarn dev`).
        ENV: 'local',

        // Environment variable for enabling plausible analytics. By default,
        // analytics are enabled for production and staging deployments, but can
        // be enabled manually for testing.
        PLAUSIBLE: JSON.stringify(
          ['prod', 'staging'].includes(process.env.ENV),
        ),
      }),
    );

    return config;
  },
});
