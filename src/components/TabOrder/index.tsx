import { Flex, Tab, TabProps, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface TabOrderProps extends TabProps {
  title: string;
  icon: IconType;
}

export function TabOrder({ icon: Icon, title, ...rest }: TabOrderProps) {
  return (
    <Tab {...(rest as any)} color="gray.600">
      <Flex align="center" justify="center" flexDir="column">
        <Icon size="1.6rem" />
        <Text fontWeight="medium" fontSize={["sm", "medium"]}>
          {title}
        </Text>
      </Flex>
    </Tab>
  );
}
