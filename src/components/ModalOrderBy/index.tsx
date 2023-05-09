import { ModalList } from "../ModalList";
import { OrderByMobile, OrderByMobileProps } from "../OrderByMobile";

interface ModalOrderByProps extends OrderByMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalOrderBy = ({
  OrderByItems,
  currentOrderByValue,
  setOrderBy,
  isOpen,
  onClose,
}: ModalOrderByProps) => {
  return (
    <ModalList title="Ordenar por" isOpen={isOpen} onClose={onClose}>
      <OrderByMobile
        OrderByItems={OrderByItems}
        currentOrderByValue={currentOrderByValue}
        setOrderBy={setOrderBy}
      />
    </ModalList>
  );
};
