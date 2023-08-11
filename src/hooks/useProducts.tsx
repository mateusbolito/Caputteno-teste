import { ProductsFetchResponse } from "@/types/products-response";
import axios, { AxiosPromise } from "axios";
import { useQuery } from "react-query";
import { useFilter } from "./useFilter";
import { FilterType } from "@/types/filter-types";
import { getCategory } from "@/utils/graphql-filters";
import { useDeferredValue } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetcher = (query: string): AxiosPromise<ProductsFetchResponse> => {
  return axios.post(API_URL, {
    query: `
        query {
            allProducts {
              id
              name
              price_in_cents
              image_url
            }
          }
       
          `,
  });
};
const MountQuery = (type: FilterType) => {
  if (type === FilterType.ALL)
    return `
  query {
      allProducts {
        id
        name
        price_in_cents
        image_url
      }
    }
 
    `;
  return `
    query {
      allProducts(filter: {category:  "${getCategory(type)}"}) {
        id
        name
        price_in_cents
        category
      }
    }
    `;
};
export function useProducts() {
  const { type, priority, search } = useFilter();
  const searchDeferred = useDeferredValue(search);
  const query = MountQuery(type);
  const { data } = useQuery({
    queryFn: () => fetcher(query),
    queryKey: ["products", type],
  });
  const products = data?.data?.data?.allProducts;
  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchDeferred.toLowerCase())
  );
  return {
    data: filteredProducts,
  };
}
