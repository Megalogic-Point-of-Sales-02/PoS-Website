import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useToast, Spinner } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { triggerCustomerChurnPrediction } from "@/utils/machineLearningModelUtils/customerChurn";
import { CustomerChurnPredictionContext } from "@/utils/predictionContext";
import { triggerCustomerSegmentationPerform } from "@/utils/machineLearningModelUtils/customerSegmentation";
import { CustomerSegmentationPerformContext } from "@/utils/performContext";
import { OrderResponse } from "@/interfaces/OrderResponse";

interface DeleteOrderProps {
  number: number | null;
  orderData: OrderResponse | undefined;
  isOpen: boolean;
  onClose: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
  handleOrderChange: () => void;
}

const DeleteOrder = ({ number, orderData, isOpen, onClose, cancelRef, handleOrderChange }: DeleteOrderProps) => {
  const toast = useToast();
  const contextChurn = useContext(CustomerChurnPredictionContext);
  const contextSegmentation = useContext(CustomerSegmentationPerformContext);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const handleDelete = async (e) => {
    setIsLoadingButton(true);
    if (orderData?.id !== null) {
      e.preventDefault();
      if (session) {
        try {
          const response = await fetch("/api/v2/orders", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session!.user.accessToken}`,
            },
            body: JSON.stringify({ id: orderData?.id }),
          });
          if (!response.ok) {
            // Wait for the message
            const errorMessage = await response.json();
            // Create an error toast
            toast({
              title: "Error",
              description: errorMessage.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          // Get Customer Data to update Total Spend
          const getCustResponse = await fetch(`/api/v2/customers?id=${orderData?.customer_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session!.user.accessToken}`,
            },
          });
          const customerData = await getCustResponse.json();
          const customerNewTotalSpend = customerData[0].total_spend - orderData?.sales!;
          if (!getCustResponse.ok) {
            // Wait for the message
            const errorMessage = await getCustResponse.json();
            // Create an error toast
            toast({
              title: "Error",
              description: errorMessage.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          // Update customer Total Spend
          const updateCustResponse = await fetch("/api/v2/customers", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session!.user.accessToken}`,
            },
            body: JSON.stringify({ customerId: orderData?.customer_id, columnName: "total_spend", value: customerNewTotalSpend }),
          });
          if (!updateCustResponse.ok) {
            // Wait for the message
            const errorMessage = await updateCustResponse.json();
            // Create an error toast
            toast({
              title: "Error",
              description: errorMessage.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }

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
          // Run predict machine learning model in background
          triggerCustomerChurnPrediction(session, contextChurn);
          triggerCustomerSegmentationPerform(session, contextSegmentation);

          handleOrderChange();
          onClose();
        } catch (error) {
          console.error("Error Deleting Order", error);
          toast({
            title: "Error",
            description: "An error occurred while deleting the order.",
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
        description: "Order ID is null",
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
              Delete Order Number {number} (ID: {orderData?.id})
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

export default DeleteOrder;
