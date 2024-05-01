import { NextRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { SelectedFilter } from "../components/ListFilter";
import { groupByObj } from "../utils/groupByObj";
import { objToForEach } from "../utils/objToForEach";

type useQueryParamsProps = {
  router: NextRouter;
  filters: SelectedFilter[];
};

const notParamsFilter = ["orderby", "search", "distinct"];

export function queryParamsToFiltersNormalized(query: ParsedUrlQuery) {
  const verifyEmptyObj = Object.values(query).length;
  const filterNormalized: SelectedFilter[] = [];

  if (verifyEmptyObj !== 0) {
    objToForEach(query, (key, value) => {
      if (!notParamsFilter.includes(key)) {
        if (typeof value === "string") {
          const [field, valueSplit] = value.split("|");

          filterNormalized.push({
            name: key,
            field: field,
            value: isNaN(Number(valueSplit)) ? valueSplit : Number(valueSplit),
          });
        } else {
          const valueArr = value as string[];

          valueArr.forEach((itemValue) => {
            const [field, valueSplit] = itemValue.split("|");

            filterNormalized.push({
              name: key,
              field: field,
              value: isNaN(Number(valueSplit))
                ? valueSplit
                : Number(valueSplit),
            });
          });
        }
      }
    });
  }

  return filterNormalized;
}

export function useQueryParamsFilterList({
  router,
  filters,
}: useQueryParamsProps) {
  const { query } = router;

  useEffect(() => {
    if (filters.length > 0) {
      const groupFilters = groupByObj<SelectedFilter>(
        filters,
        (item) => item.name
      );
      var queryNormalized = {};

      for (const filterGroup of groupFilters) {
        queryNormalized = {
          ...queryNormalized,
          [String(filterGroup.value)]:
            filterGroup.data.length <= 1
              ? `${filterGroup.data[0].field}|${filterGroup.data[0].value}`
              : filterGroup.data.map((item) => `${item.field}|${item.value}`),
        };
      }

      if (query?.distinct) {
        queryNormalized = { ...queryNormalized, distinct: query.distinct };
      }
      if (query?.orderby) {
        queryNormalized = { ...queryNormalized, orderby: query.orderby };
      }

      router.replace(
        {
          query: { ...queryNormalized },
        },
        undefined,
        { scroll: false }
      );
    } else {
      var queryNormalized = {};

      notParamsFilter.forEach((p) => {
        if (query[p]) {
          queryNormalized = { ...queryNormalized, [p]: query[p] };
        }
      });

      router.replace(
        {
          query: queryNormalized,
        },
        undefined,
        { scroll: false }
      );
    }
  }, [filters]);

  return {
    queryParams: query,
    queryParamsToFiltersNormalized: queryParamsToFiltersNormalized(query),
  };
}
