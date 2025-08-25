import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login } from "../../lib/api/auth";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message)
    },
  });

  return { loginMutation: mutate, isLoggingIn: isPending, loginError: error };
};

export default useLogin;
