import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RequestStatus, UserProfile, Variant_internal_display } from '@/backend';

export function useCreateServiceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      contactInfo: string;
      servicesRequested: string[];
      totalPriceEstimate: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createServiceRequest(
        data.customerName,
        data.contactInfo,
        data.servicesRequested,
        data.totalPriceEstimate,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });
}

export function useServiceRequestLookup(requestId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['serviceRequest', requestId],
    queryFn: async () => {
      if (!actor || !requestId) return null;
      return actor.getServiceRequest(BigInt(requestId));
    },
    enabled: !!actor && !actorFetching && !!requestId,
  });
}

export function useFullServiceRequest(requestId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['fullServiceRequest', requestId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFullServiceRequest(BigInt(requestId));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAllServiceRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['serviceRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServiceRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useServiceRequestsByStatus(status: RequestStatus | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['serviceRequestsByStatus', status],
    queryFn: async () => {
      if (!actor || !status) return [];
      return actor.getServiceRequestsByStatus(status);
    },
    enabled: !!actor && !actorFetching && !!status,
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { requestId: bigint; newStatus: RequestStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRequestStatus(data.requestId, data.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['fullServiceRequest'] });
      queryClient.invalidateQueries({ queryKey: ['serviceRequestsByStatus'] });
    },
  });
}

export function useUpdatePriceEstimate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { requestId: bigint; priceEstimate: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      // Note: Backend doesn't have a separate updatePriceEstimate method
      // This would need to be handled through a backend update or via notes
      // For now, we'll just invalidate queries to refresh data
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['fullServiceRequest'] });
    },
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requestId: bigint;
      noteType: Variant_internal_display;
      author: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNote(data.requestId, data.noteType, data.author, data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fullServiceRequest'] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Alias for backward compatibility
export const useIsCallerAdmin = useIsAdmin;

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Alias for backward compatibility
export const useCallerUserProfile = useGetCallerUserProfile;

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
