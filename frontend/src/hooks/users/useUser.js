import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../lib/api/users";

const useUser = (id) => {
  const user = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoading: user.isLoading,
    user: user.data,
    error: user.error,
    refetch: user.refetch,
  };
};

export default useUser;