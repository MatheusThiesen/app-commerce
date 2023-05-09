import { Flex, Spinner } from "@chakra-ui/react";
import { ReactNode } from "react";

interface LoadingInfiniteScrollProps {
  isLoading?: boolean;
  isLoadingNextPage?: boolean;
  children?: ReactNode;
}

export const LoadingInfiniteScroll = ({
  isLoading = false,
  isLoadingNextPage = false,
  children,
}: LoadingInfiniteScrollProps) => {
  if (isLoading)
    return (
      <Flex h="50vh" w="100%" justify="center" align="center">
        <Spinner ml="4" size="xl" />
      </Flex>
    );

  return (
    <>
      {children}

      {isLoadingNextPage && (
        <Flex w="100%" justify="center" align="center">
          <Spinner mb="8" mt="4" ml="4" size="lg" />
        </Flex>
      )}
    </>
  );
};
