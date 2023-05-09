import { Flex, FlexProps, Spinner } from "@chakra-ui/react";
import { ReactNode } from "react";

interface PanelLayoutProps extends FlexProps {
  isLoading?: boolean;
  children?: ReactNode;
}

export const PanelLayout = ({
  isLoading = false,
  children,
  ...rest
}: PanelLayoutProps) => {
  return (
    <>
      {isLoading ? (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      ) : (
        <>
          <Flex
            pt={["6.5rem", "6.5rem", "6.5rem", "7rem"]}
            pb={["7rem"]}
            justify="center"
            w="full"
            {...(rest as any)}
          >
            <Flex w="full" maxW="1200px">
              {children}
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};
