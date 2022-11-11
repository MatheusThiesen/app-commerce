import {
  Box,
  Icon,
  Link as CharkraLink,
  LinkProps as ChakraLinkProps,
  Text,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import { useRouter } from "next/router";
import { ElementType, useEffect, useState } from "react";

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  icon: ElementType;
  href: string;
}

export function MainNavLink({ href, icon, children, ...rest }: NavLinkProps) {
  const { asPath } = useRouter();
  const [isActiveLink, setIsActiveLink] = useState(false);

  useEffect(() => {
    if (asPath === href) {
      return setIsActiveLink(true);
    }

    if (asPath !== href && isActiveLink) {
      setIsActiveLink(false);
    }
  }, [asPath]);

  return (
    <LinkNext href={href}>
      <CharkraLink
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-end"
        pb="0.50rem"
        position="relative"
        _hover={{ textDecoration: "none" }}
        {...(rest as any)}
      >
        <Box
          h="14"
          w="14"
          bg={isActiveLink ? "white" : "red.500"}
          borderRadius="full"
          display="flex"
          alignItems="center"
          boxShadow="md"
          justifyContent="center"
          position="absolute"
          bottom={"1.9rem"}
          transition="background 0.3s"
        >
          <Icon
            as={icon}
            fontSize="30"
            color={isActiveLink ? "red.500" : "white"}
          />
        </Box>
        <Text
          fontSize="sm"
          fontWeight="400"
          color={isActiveLink ? "red.500" : "gray.800"}
          transition="color 0.3s"
        >
          {children}
        </Text>
      </CharkraLink>
    </LinkNext>
  );
}
