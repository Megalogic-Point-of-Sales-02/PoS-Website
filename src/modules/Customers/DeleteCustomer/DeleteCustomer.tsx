import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

interface DeleteCustomerProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  handleCustomerChange: () => void;
}

const DeleteCustomer = ({ id, isOpen, onClose, cancelRef, handleCustomerChange }: DeleteCustomerProps) => {
  const { data: session, status } = useSession();
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  const handleDelete = async (e) => {
    setIsLoadingButton(true);
    if (id !== null) {
      console.log("deleting customer with id", id.toString());
      e.preventDefault();
      if (session) {
        try {
          const response = await fetch("/api/v2/customers", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session!.user.accessToken}`,
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
              description: `${message.message}`,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            handleCustomerChange();
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
        } finally {
          setIsLoadingButton(false);
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Customer ID is null",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingButton(false);
    }
  };

  return (
    <div>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} closeOnOverlayClick={false}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer With ID {id}
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                {isLoadingButton ? <Spinner /> : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default DeleteCustomer;
