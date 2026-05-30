import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"
import type { CheckOutSessionRequest, CheckoutSessionResponse, Order, UpdateOrderStatusRequest } from "./types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCreateCheckOutSession() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  const createCheckOutSessionRequest = async (
    checkOutSessionRequest: CheckOutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const accessToken = await getAccessTokenSilently()

    const res = await fetch(
      API_BASE_URL + "/api/order/checkout/create-checkout-session",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkOutSessionRequest),
      }
    )
    if (!res.ok) {
      throw new Error("Error al crear la sesion de checkout de stripe")
    }
    return res.json()
  }
  return useMutation<CheckoutSessionResponse, Error, CheckOutSessionRequest>({
    mutationFn: (checkOutSessionRequest: CheckOutSessionRequest) =>
      createCheckOutSessionRequest(checkOutSessionRequest),
    onError: (err) => {
      toast.error("Error al crear la sesion de checkout en stripe")
      console.log(err)
      throw new Error("Error al crear la sesion de checkout en stripe")
    },
    onSuccess: (order) => {
      toast.success("Sesion de checkout en stripe creada correctamente")
      console.log(order)
      queryClient.invalidateQueries({ queryKey: ["order"] })
    },
  })
}

// Hook para obtener las ordenes de un usuario del backend
export function useGetOrders() {
  const { getAccessTokenSilently } = useAuth0()

  const getOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(API_BASE_URL + "/api/order", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      throw new Error("Error al obtener los datos del restaurante")
    }
    return res.json()
  }

  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersRequest,
    refetchInterval: 5000,
  })
}

// Hook para obtener todas las ordenes de un restaurante del backend
export function useGetRestaurantOrders() {
  const { getAccessTokenSilently } = useAuth0()

  const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(API_BASE_URL + "/api/order/order", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      throw new Error("Error al obtener los datos del restaurante")
    }
    return res.json()
  }

  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: getRestaurantOrdersRequest,
    refetchInterval: 5000,
  })
}

// Hook para actualizar el status de una orden en el backend
export function useUpdateRestauranteOrder() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  const updateRestauranteOrderRequest = async (
    updateOrderStatusRequest: UpdateOrderStatusRequest
  ): Promise<Order> => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(
      API_BASE_URL + "/api/order/" + updateOrderStatusRequest.orderId + "/status",
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updateOrderStatusRequest.status }),
      }
    )
    if (!res.ok) {
      throw new Error("Error al actualizar el status de la orden")
    }
    return res.json()
  }

  return useMutation<Order, Error, UpdateOrderStatusRequest>({
    mutationFn: updateRestauranteOrderRequest,
    onError: (err) => {
      console.log(err)
      toast.error("Error al actualizar el estatus de la orden")
    },
    onSuccess: () => {
      toast.success("Orden del restaurante actualizada")
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    },
  })
}

