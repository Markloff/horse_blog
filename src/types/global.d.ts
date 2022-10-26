
interface MarkdownRemark {
  content: string;
  desc: string;
  slug: string;
  title: string;
}

interface Window {
  __LUNR__: {
    zh: {
      index: import("lunr").Index;
      store: Record<string, MarkdownRemark>;
    };
  };
}
