import { Node as GatsbyNode } from "gatsby";

interface Frontmatter {
  date?: string;
  slug?: string;
  template?: string;
  category?: string;
  title?: string;
  description?: string;
  tags?: Array<string>;
}

interface Node extends GatsbyNode {
  frontmatter?: Frontmatter;
  rawMarkdownBody: string;
}

export default Node;
