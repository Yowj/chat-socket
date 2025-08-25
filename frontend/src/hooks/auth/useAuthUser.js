import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../../lib/api/auth";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  return { 
    isLoading: authUser.isLoading, 
    authUser: authUser.data, 
    error: authUser.error };
};

export default useAuthUser;
