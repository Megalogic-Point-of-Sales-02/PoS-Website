import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast } from "@chakra-ui/react";
import React from "react";

interface DeleteOrderProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  handleOrderChange: () => void;
}

const DeleteOrder = ({ id, isOpen, onClose, cancelRef, handleOrderChange }: DeleteOrderProps) => {
  const toast = useToast();

  const handleDelete = async (e) => {
    if (id !== null) {
      console.log("deleting order with id", id.toString());
      e.preventDefault();
      try {
        const response = await fetch("/api/v1/orders", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });

        if (!response.ok) {
          // Wait for the message
          const errorMessage = await response.json();
          // Create an error toast
          toast({
            title: "Error",
            description: errorMessage,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        } else {
          // Wait for the message
          const message = await response.json();
          // Create a success toast
          toast({
            title: "Success",
            description: `Order with ID ${id} is deleted`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          handleOrderChange();
          onClose();
        }
      } catch (error) {
        console.error("Error Deleting Order", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the order.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Order ID is null",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Order With ID {id}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default DeleteOrder;
