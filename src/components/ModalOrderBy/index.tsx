import { ModalList } from "../ModalList";
import { OrderByMobile, OrderByMobileProps } from "../OrderByMobile";

interface ModalOrderByProps extends OrderByMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalOrderBy = ({
  orderByItems,
  currentOrderByValue,
  setOrderBy,
  isOpen,
  onClose,
}: ModalOrderByProps) => {
  return (
    <ModalList
      title="Ordenar por"
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
    >
      <OrderByMobile
        orderByItems={orderByItems}
        currentOrderByValue={currentOrderByValue}
        setOrderBy={setOrderBy}
      />
    </ModalList>
  );
};
