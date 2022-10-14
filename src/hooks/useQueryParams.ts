import React from "react";

type SetQueryParamsParams = {
  data: {
    field: string;
    value?: string | string[];
  };
  type: "append" | "set" | "delete";
  history: any;
};

export function useQueryParams() {
  function getQueryParams() {
    const search = "";

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  function setQueryParams({ data, type, history }: SetQueryParamsParams) {
    const params = new URLSearchParams(history?.location?.search);

    const { field, value } = data;

    if (value) {
      if (typeof value === "string") {
        params[type](field, value);
      } else {
        value.forEach((item) => {
          params[type](field, item);
        });
      }
    }

    if (type === "delete") params.delete(field);

    history.push({ search: params.toString() });
  }

  return {
    getQueryParams,
    setQueryParams,
  };
}
