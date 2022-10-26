import React, { SVGProps, useRef } from "react";

import * as styles from "./style.module.scss";

const SearchIcon: React.FC<SVGProps<never>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="icon"
    viewBox="0 0 1024 1024"
    width="16"
    height="16"
    data-spm-anchor-id="a313x.7781069.0.i6"
    {...props}
  >
    <path
      d="M945.066667 898.133333l-189.866667-189.866666c55.466667-64 87.466667-149.333333 87.466667-241.066667 0-204.8-168.533333-373.333333-373.333334-373.333333S96 264.533333 96 469.333333 264.533333 842.666667 469.333333 842.666667c91.733333 0 174.933333-34.133333 241.066667-87.466667l189.866667 189.866667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c8.533333-12.8 8.533333-34.133333-2.133333-46.933334zM469.333333 778.666667C298.666667 778.666667 160 640 160 469.333333S298.666667 160 469.333333 160 778.666667 298.666667 778.666667 469.333333 640 778.666667 469.333333 778.666667z"
      fill="#6B778C"
    />
  </svg>
);

type SearchProps = {
  onChange: (query: string) => void;
};

const Search: React.FC<SearchProps> = (props) => {
  const { onChange } = props;

  const refState = useRef({
    onComposition: false,
  });

  const handleComposition: React.CompositionEventHandler<HTMLInputElement> = (
    ev,
  ) => {
    refState.current.onComposition = ev.type !== "compositionend";
    if (ev.type === "compositionend") {
      onChange((ev.currentTarget as HTMLInputElement).value);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (!refState.current.onComposition) {
      onChange(input.trim());
    }
  };

  return (
    <div className={styles.search_wrapper}>
      <SearchIcon className={styles.search_icon} />
      <input
        className={styles.search_input}
        name="natulata_query"
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
