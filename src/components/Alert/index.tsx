import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ModalAlertProps {
  title: string;
  description: string;

  isOpen: boolean;
  onClose: () => void;
  closeDescription?: string;
  closeColorSchema?: string;

  onAction?: () => void;
  actionDescription?: string;
}

export function Alert({
  title,
  description,
  isOpen,
  onClose,
  closeDescription = "Fechar",
  closeColorSchema = "red",
  onAction,
  actionDescription = "SIM",
}: ModalAlertProps) {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter className="gap-2">
          <Button ref={cancelRef} onClick={onClose} variant="outline">
            {closeDescription}
          </Button>

          {onAction && (
            <Button
              ref={cancelRef}
              onClick={onAction}
              colorScheme={closeColorSchema}
            >
              {actionDescription}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
