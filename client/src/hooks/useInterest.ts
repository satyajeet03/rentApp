import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { interestApi } from "../services/api";

// hooks/useToggleInterest.ts
export const useToggleInterest = (propertyId: string) => {
    const queryClient = useQueryClient();
  
    const { data: interestStatus } = useQuery({
      queryKey: ['interest-status', propertyId],
      queryFn: () => interestApi.checkInterest(propertyId),
      enabled: !!propertyId,
    });
  
    const addMutation = useMutation({
      mutationFn: interestApi.addInterest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interest-status', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['my-interests'] });
      },
    });
  
    const removeMutation = useMutation({
      mutationFn: interestApi.removeInterest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interest-status', propertyId] });
        queryClient.invalidateQueries({ queryKey: ['my-interests'] });
      },
    });
  
    const toggleInterest = (onDone?: () => void) => {
      if (interestStatus?.interested) {
        removeMutation.mutate(propertyId, { onSuccess: onDone });
      } else {
        addMutation.mutate(propertyId, { onSuccess: onDone });
      }
    };
  
    return {
      toggleInterest,
      isInterested: interestStatus?.interested || false,
      isLoading: addMutation.isPending || removeMutation.isPending,
    };
  };