import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"
import type { Restaurante } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getRestaurantRequest = async (
  accessToken: string
): Promise<Restaurante | null> => {
  const res = await fetch(API_BASE_URL + "/api/restaurante", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error("Error al obtener el restaurante")
  }

  return res.json()
}

const createRestaurantRequest = async (
  accessToken: string,
  formData: FormData
) => {
  const res = await fetch(API_BASE_URL + "/api/restaurante", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    console.error("createRestaurantRequest error", res.status, errorBody)
    throw new Error("Error al crear el restaurante")
  }

  return res.json()
}

const updateRestaurantRequest = async (
  accessToken: string,
  formData: FormData
) => {
  const res = await fetch(API_BASE_URL + "/api/restaurante", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    console.error("updateRestaurantRequest error", res.status, errorBody)
    throw new Error("Error al actualizar el restaurante")
  }

  return res.json()
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const accessToken = await getAccessTokenSilently()
      return createRestaurantRequest(accessToken, formData)
    },
    onSuccess: () => {
      toast.success("Restaurante creado correctamente")
      queryClient.invalidateQueries({ queryKey: ["restaurant"] })
    },
    onError: (error) => {
      console.error(error)
      toast.error("No se pudo crear el restaurante")
    },
  })
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const accessToken = await getAccessTokenSilently()
      return updateRestaurantRequest(accessToken, formData)
    },
    onSuccess: () => {
      toast.success("Restaurante actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: ["restaurant"] })
    },
    onError: (error) => {
      console.error(error)
      toast.error("No se pudo actualizar el restaurante")
    },
  })
}

export function useGetRestaurant() {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const accessToken = await getAccessTokenSilently()
      return getRestaurantRequest(accessToken)
    },
    retry: false,
  })
}

import type { SearchState } from "../pages/SearchPage";
import type { RestaurantSearchResponse } from "./types";

export function useSearchRestaurants(
  searchState: SearchState,
  city?: string
) {
  const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurante/search/${city}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: results, isLoading } = useQuery({
    queryKey: ["searchRestaurants", searchState],
    queryFn: createSearchRequest,
    enabled: !!city,
  });

  return {
    results,
    isLoading,
  };
}
