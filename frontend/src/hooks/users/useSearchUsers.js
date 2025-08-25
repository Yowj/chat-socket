import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../../lib/api/users";

const useSearchUsers = (query) => {
  const search = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query),
    enabled: !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    isSearching: search.isLoading,
    searchResults: search.data,
    searchError: search.error,
    refetchSearch: search.refetch,
  };
};

export default useSearchUsers;