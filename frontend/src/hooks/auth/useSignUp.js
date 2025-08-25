import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../../lib/api/auth";
import toast from "react-hot-toast";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }), toast.success("Signup successful");
    },
  });

  return { isPending, signupError: error, signupMutation: mutate };
};

export default useSignUp;
