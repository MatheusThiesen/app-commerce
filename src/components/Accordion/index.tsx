import {
  AccordionButton,
  Accordion as AccordionChakra,
  AccordionProps as AccordionChakraProps,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";
import { ReactNode, memo } from "react";

type Props = AccordionChakraProps & {
  isOpen: boolean;
  title: string;
  children: ReactNode;
};

function AccordionComponent({ isOpen, title, children, ...props }: Props) {
  return (
    <AccordionChakra
      defaultIndex={isOpen ? [0] : [1]}
      allowToggle
      w="full"
      bg="white"
      borderRadius="md"
      {...(props as any)}
    >
      <AccordionItem border={0}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text fontSize="md" color="gray.800" fontWeight="bold">
              {title}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={2} pt={2}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </AccordionChakra>
  );
}

export const Accordion = memo(AccordionComponent);
