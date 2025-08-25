import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboarding } from "../../lib/api/auth";
import toast from "react-hot-toast";

const useOnboarding = () => {
  const queryClient = useQueryClient();

  const onboardingMutation = useMutation({
    mutationFn: onboarding,
    onSuccess: (data) => {
      toast.success(data.message || "Profile setup completed!");
      // Update the user data in cache
      queryClient.setQueryData(["authUser"], data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Onboarding failed");
    },
  });

  return {
    onboardingMutation: onboardingMutation.mutate,
    isOnboarding: onboardingMutation.isPending,
    onboardingError: onboardingMutation.error,
    onboardingData: onboardingMutation.data,
  };
};

export default useOnboarding;