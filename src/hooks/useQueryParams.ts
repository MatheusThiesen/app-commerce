import { NextRouter } from "next/router";

type SetQueryParamsParams = {
  data: {
    field: string;
    value?: string | string[];
  };
  type: "set" | "delete";
};

type useQueryParamsProps = {
  router: NextRouter;
};

export function useQueryParams({ router }: useQueryParamsProps) {
  function getQueryParams(key: string) {
    return router.query[key];
  }

  function setQueryParams({ data, type }: SetQueryParamsParams) {
    const queryNormalized = router.query as any;

    const { field, value } = data;

    if (type === "set") {
      if (value) {
        queryNormalized[field] = value;
      } else {
        delete queryNormalized[field];
      }
    }

    if (type === "delete") delete queryNormalized[field];

    router.replace(
      {
        query: queryNormalized,
      },
      undefined,
      { scroll: false }
    );
  }

  return {
    getQueryParams,
    setQueryParams,
  };
}
