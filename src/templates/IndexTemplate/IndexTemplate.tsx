import React, { useMemo, useState } from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/Feed";
import { Layout } from "@/components/Layout";
import { Meta } from "@/components/Meta";
import { Page } from "@/components/Page";
import { Pagination } from "@/components/Pagination";
import Search from "@/components/Search";
import { Sidebar } from "@/components/Sidebar";
import { useSiteMetadata } from "@/hooks";
import { AllMarkdownRemark, PageContext } from "@/types";

interface Props {
  data: {
    allMarkdownRemark: AllMarkdownRemark;
  };
  pageContext: PageContext;
}

const IndexTemplate: React.FC<Props> = ({ data, pageContext }: Props) => {
  const { pagination } = pageContext;
  const { hasNextPage, hasPrevPage, prevPagePath, nextPagePath } = pagination;
  const [query, setQuery] = useState<string>("");

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const edges = useMemo(() => {
    if (!query || !window.__LUNR__) {
      return data.allMarkdownRemark.edges;
    }
    const lunrIndex = window.__LUNR__.zh;
    const searchResult = lunrIndex.index
      .search(query)
      .map(({ ref }) => lunrIndex.store[ref]);
    const set = new Set();
    searchResult.forEach((item) => set.add(item.slug));
    return data.allMarkdownRemark.edges.filter(
      (edge) =>
        set.has(edge.node.frontmatter.slug) ||
        edge.node.frontmatter.title.includes(query) ||
        edge.node.frontmatter.description?.includes(query),
    );
  }, [query, data.allMarkdownRemark]);

  return (
    <Layout>
      <Sidebar isIndex />
      <Page>
        <Search onChange={handleQueryChange} />
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query IndexTemplate($limit: Int!, $offset: Int!) {
    allMarkdownRemark(
      limit: $limit
      skip: $offset
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
    ) {
      edges {
        node {
          fields {
            categorySlug
            slug
          }
          frontmatter {
            description
            category
            title
            date
            slug
          }
        }
      }
    }
  }
`;

export const Head: React.FC<Props> = ({ pageContext }) => {
  const { title, subtitle } = useSiteMetadata();
  const {
    pagination: { currentPage: page },
  } = pageContext;
  const pageTitle = page > 0 ? `Posts - Page ${page} - ${title}` : title;

  return <Meta title={pageTitle} description={subtitle} />;
};

export default IndexTemplate;
