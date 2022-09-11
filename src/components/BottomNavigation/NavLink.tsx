import {
  Icon,
  Link as CharkraLink,
  LinkProps as ChakraLinkProps,
  Text,
} from "@chakra-ui/react";
import { ElementType } from "react";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  icon: ElementType;
  href: string;
}

export function NavLink({ href, icon, children, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href}>
      <CharkraLink
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-end"
        pb="0.50rem"
        _hover={{ textDecoration: "none" }}
        {...(rest as any)}
      >
        <Icon as={icon} fontSize="20" />
        <Text fontSize="sm" fontWeight="light">
          {children}
        </Text>
      </CharkraLink>
    </ActiveLink>
  );
}
