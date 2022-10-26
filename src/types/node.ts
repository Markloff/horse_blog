import Fields from "./fields";
import Frontmatter from "./frontmatter";

interface Node {
  id: string;
  fields: Fields;
  frontmatter: Frontmatter;
  html: string;
}

export interface MarkdownRemark {
  content: string;
  desc: string;
  slug: string;
  title: string;
}

export default Node;
