import React from "react";
import renderer from "react-test-renderer";

import { render as reactTestingLibraryRender } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils";

import NotFoundTemplate, { Head as GatsbyHead } from "./NotFoundTemplate";

const mockedStaticQuery = StaticQuery as jest.Mock;
const mockedUseStaticQuery = useStaticQuery as jest.Mock;

describe("NotFoundTemplate", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = renderer.create(<NotFoundTemplate />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    reactTestingLibraryRender(<GatsbyHead />);

    expect(getMeta("twitter:card")).toEqual("summary_large_image");
    expect(getMeta("twitter:title")).toEqual(
      "Not Found - Blog by Manoko Group",
    );
    expect(getMeta("og:title")).toEqual("Not Found - Blog by Manoko Group");
    expect(getMeta("description")).toEqual("年轻人，愿你照耀中国");
    expect(getMeta("twitter:description")).toEqual("年轻人，愿你照耀中国");
    expect(getMeta("og:description")).toEqual("年轻人，愿你照耀中国");
  });
});
