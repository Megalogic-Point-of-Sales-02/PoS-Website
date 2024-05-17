import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast } from "@chakra-ui/react";
import React from "react";

interface DeleteCustomerProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
}

const DeleteCustomer = ({ id, isOpen, onClose, cancelRef }: DeleteCustomerProps) => {
  const toast = useToast();

  const handleDelete = async (e) => {
    console.log("deleting cust with id", id.toString());
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/customers", {
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
          description: errorMessage.error,
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
          description: `${message}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error Deleting Customer", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the customer.",
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
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

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

export default DeleteCustomer;
