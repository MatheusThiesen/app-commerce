import { Button, Center, Flex, Icon } from "@chakra-ui/react";

import { LuLayoutGrid } from "react-icons/lu";
import { RxBox } from "react-icons/rx";
import { TbLayoutBottombar } from "react-icons/tb";

interface Props {
  layout: 1 | 2 | 3;
  setLayout: (layout: 1 | 2 | 3) => void;
}

export function SwitchLayout({ layout = 1, setLayout }: Props) {
  return (
    <Flex
      columnGap="2"
      bg="white"
      borderRadius="full"
      h="10"
      position="relative"
    >
      <Center
        h="12"
        w="12"
        borderRadius="full"
        bg="red.500"
        position="absolute"
        left={layout === 3 ? "90px" : layout === 2 ? "45px" : "-2px"}
        top="-3px"
        transition="0.2s"
      />

      <Button
        onClick={() => setLayout(1)}
        type="button"
        borderRadius="full"
        bg="transparent"
        variant="unstyled"
      >
        <Center>
          <Icon
            color={layout === 1 ? "white" : "red.500"}
            fontSize="20"
            as={RxBox}
          />
        </Center>
      </Button>

      <Button
        onClick={() => setLayout(2)}
        type="button"
        borderRadius="full"
        bg="transparent"
        variant="unstyled"
      >
        <Center>
          <Icon
            color={layout === 2 ? "white" : "red.500"}
            fontSize="22"
            as={LuLayoutGrid}
          />
        </Center>
      </Button>

      <Button
        onClick={() => setLayout(3)}
        type="button"
        borderRadius="full"
        bg="transparent"
        variant="unstyled"
      >
        <Center>
          <Icon
            color={layout === 3 ? "white" : "red.500"}
            fontSize="26"
            as={TbLayoutBottombar}
          />
        </Center>
      </Button>
    </Flex>
  );
}
