import React from "react";
import renderer from "react-test-renderer";

import { render as reactTestingLibraryRender } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils";

import CategoryTemplate, { Head as GatsbyHead } from "./CategoryTemplate";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("CategoryTemplate", () => {
  const props = {
    data: {
      allMarkdownRemark: mocks.allMarkdownRemark,
    },
    pageContext: mocks.pageContext,
  };

  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = renderer.create(<CategoryTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    reactTestingLibraryRender(<GatsbyHead {...props} />);

    expect(getMeta("twitter:card")).toEqual("summary_large_image");
    expect(getMeta("og:title")).toEqual(
      "Typography - Page 2 - Blog by Manoko Group",
    );
    expect(getMeta("twitter:title")).toEqual(
      "Typography - Page 2 - Blog by Manoko Group",
    );
    expect(getMeta("twitter:description")).toEqual("年轻人，愿你照耀中国");
    expect(getMeta("description")).toEqual("年轻人，愿你照耀中国");
    expect(getMeta("og:description")).toEqual("年轻人，愿你照耀中国");
  });
});
