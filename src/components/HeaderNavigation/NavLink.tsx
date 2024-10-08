import {
  LinkProps as ChakraLinkProps,
  Link as CharkraLink,
} from "@chakra-ui/react";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  children: string;
  href: string;
}

export function NavLink({ href, children, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref>
      <CharkraLink
        h="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        fontSize="md"
        _hover={{ textDecoration: "none" }}
        {...(rest as any)}
      >
        {children}
      </CharkraLink>
    </ActiveLink>
  );
}
