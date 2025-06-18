import React from "react";
import { SearchIcon } from "../icons";

import "./index.scss";

type SearchComponentProps = {
  placeholder?: string;
  onSearch?: (value: string | null) => void;
  value?: string;
  autoFocus?: boolean;
};

const SearchComponent: React.FC<SearchComponentProps> = (
  props: SearchComponentProps,
) => {
  const { onSearch, ...rest } = props;
  return (
    <div className="search-component">
      <span className="search-icon">
        <SearchIcon />
      </span>
      <input
        type="search"
        className="form-input"
        onChange={(e) => {
          if (onSearch) {
            onSearch(e.target.value);
          }
        }}
        style={{ width: "100%" }}
        {...rest}
      />
    </div>
  );
};

export default SearchComponent;
