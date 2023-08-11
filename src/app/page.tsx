"use client";
import { FilterBar } from "@/components/filter-bar";
import styles from "./page.module.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { ProductsList } from "@/components/pruducts-list";
export default function Home() {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <main className={styles.main}>
        <FilterBar />
        <ProductsList />
      </main>
    </QueryClientProvider>
  );
}
