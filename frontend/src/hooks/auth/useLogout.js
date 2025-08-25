import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../lib/api/auth";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { error, isLoggingOut: isPending, logoutMutation: mutate };
};

export default useLogout;
