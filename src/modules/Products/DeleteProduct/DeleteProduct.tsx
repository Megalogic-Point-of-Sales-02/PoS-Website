import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface DeleteProductProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  handleProductChange: () => void;
}

const DeleteProduct = ({ id, isOpen, onClose, cancelRef, handleProductChange }: DeleteProductProps) => {
  const toast = useToast();
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const { data: session, status} = useSession();

  const handleDelete = async (e) => {
    setIsLoadingButton(true);
    if (id !== null) {
      console.log("deleting product with id", id.toString());
      e.preventDefault();
      if(session){
      try {
        const response = await fetch("/api/v1/products", {
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
            description: `Product with ID ${id} is deleted`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          handleProductChange();
          onClose();
        }
      } catch (error) {
        console.error("Error Deleting product", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the product.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingButton(false);
      }
    }} else {
      toast({
        title: "Error",
        description: "Product ID is null. Please try again.",
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
              Delete product with ID: {id}
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

export default DeleteProduct;
