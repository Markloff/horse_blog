import path from "path";

import config from "./content/config.json";
import * as types from "./internal/gatsby/types";

export default {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    url: config.url,
    menu: config.menu,
    title: config.title,
    author: config.author,
    subtitle: config.subtitle,
    copyright: config.copyright,
    postsLimit: config.postsLimit,
    disqusShortname: config.disqusShortname,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: path.resolve("content"),
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({
              query: { site, allMarkdownRemark },
            }: {
              query: {
                site: {
                  siteMetadata: {
                    url: string;
                  };
                };
                allMarkdownRemark: {
                  edges: Array<types.Edge>;
                };
              };
            }) =>
              allMarkdownRemark.edges.map(({ node }) => ({
                ...node.frontmatter,
                date: node?.frontmatter?.date,
                description: node?.frontmatter?.description,
                url:
                  site.siteMetadata.url +
                  (node.frontmatter?.slug || node.fields?.slug),
                guid:
                  site.siteMetadata.url +
                  (node.frontmatter?.slug || node.fields?.slug),
                custom_elements: [{ "content:encoded": node.html }],
              })),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        date
                        title
                        slug
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: config.title,
          },
        ],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 960,
              withWebp: true,
            },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: { wrapperStyle: "margin-bottom: 1.0725rem" },
          },
          "gatsby-remark-autolink-headers",
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
          "gatsby-remark-external-links",
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: [config.googleAnalyticsId],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl: url
              }
            }
            allSitePage(
              filter: {
                path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
              }
            ) {
              nodes {
                path
              }
            }
          }
        `,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.title,
        short_name: config.title,
        theme_color: "hsl(31, 92%, 62%)",
        background_color: "hsl(0, 0%, 100%)",
        icon: "content/photo.jpg",
        display: "standalone",
        start_url: "/",
      },
    },
    {
      resolve: "gatsby-plugin-offline",
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              urlPattern: /(\.js$|\.css$|[^:]static\/)/,
              handler: "CacheFirst",
            },
            {
              urlPattern: /^https?:.*\/page-data\/.*\.json/,
              handler: "StaleWhileRevalidate",
            },
            {
              urlPattern:
                /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
              handler: "StaleWhileRevalidate",
            },
            {
              urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
              handler: "StaleWhileRevalidate",
            },
          ],
        },
      },
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1,
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-optimize-svgs",
    "gatsby-plugin-sass",
    /*
     * {
     *   resolve: "gatsby-plugin-local-search",
     *   options: {
     *     name: "pages",
     *     engine: "lunr",
     *     query: `
     *       {
     *         allMarkdownRemark(
     *           limit: 1000
     *           sort: {order: DESC, fields: [frontmatter___date]}
     *           filter: {frontmatter: {template: {eq: "post"}, draft: {ne: true}}}
     *         ) {
     *             nodes {
     *             id
     *             frontmatter {
     *               slug
     *               title
     *             }
     *             rawMarkdownBody
     *           }
     *         }
     *       }
     *     `,
     *     ref: "id",
     *     index: ["title", "content", "path"],
     *     store: ["title", "content", "id"],
     *     normalizer: ({
     *       data: { allMarkdownRemark },
     *     }: {
     *       data: {
     *         allMarkdownRemark: {
     *           nodes: Array<types.Node>;
     *         };
     *       };
     *     }) =>
     *       allMarkdownRemark.nodes.map((node) => ({
     *         id: node.id,
     *         path: node.frontmatter?.slug || "",
     *         title: node.frontmatter?.title || "",
     *         content: node.rawMarkdownBody,
     *       })),
     *   },
     * },
     */
    {
      resolve: "gatsby-plugin-lunr",
      options: {
        languages: [{ name: "zh" }],
        /*
         * Fields to index. If store === true value will be stored in index file.
         * Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
         */
        fields: [
          { name: "id" },
          { name: "title", store: true, attributes: { boost: 5 } },
          { name: "desc", store: true, attributes: { boost: 5 } },
          { name: "slug", store: true },
          { name: "content", store: true, attributes: { boost: 20 } },
        ],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // 这里修改成你的gatsby数据节点，根据这些数据形成索引(index)
          MarkdownRemark: {
            id: (node: types.Node) => node.id,
            title: (node: types.Node) => node.frontmatter?.title || "",
            desc: (node: types.Node) => node.frontmatter?.description || "",
            slug: (node: types.Node) => node.frontmatter?.slug || "",
            content: (node: types.Node) => node.rawMarkdownBody,
          },
        },
      },
    },
  ],
};
