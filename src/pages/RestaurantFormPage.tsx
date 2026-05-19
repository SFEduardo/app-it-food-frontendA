"use client"

import {
  useGetRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
} from "@/api/RestaurantApi"
import RestaurantForm, {
  type RestaurantFormValues,
} from "@/forms/restaurant-form/RestaurantForm"
import LoadingButton from "@/components/LoadingButton"

export default function RestaurantFormPage() {
  const { data: restaurant, isLoading, isError } = useGetRestaurant()
  const createRestaurant = useCreateRestaurant()
  const updateRestaurant = useUpdateRestaurant()

  if (isLoading) return <LoadingButton />

  if (isError) {
    return <span>No se pudieron cargar los datos del restaurante</span>
  }

  const initialValues = restaurant ?? undefined

  const handleSave = (data: RestaurantFormValues) => {
    const body = new FormData()
    body.append("restaurantName", data.restaurantName)
    body.append("city", data.city)
    body.append("country", data.country)
    body.append("deliveryPrice", String(data.deliveryPrice))
    body.append("estimatedDeliveryTime", String(data.estimatedDeliveryTime))
    body.append("cuisines", JSON.stringify(data.cuisines))
    body.append("menuItems", JSON.stringify(data.menuItems))

    if (data.imageFile?.length > 0) {
      body.append("imageFile", data.imageFile[0])
    }

    if (initialValues) {
      updateRestaurant.mutate(body)
    } else {
      createRestaurant.mutate(body)
    }
  }

  return (
    <RestaurantForm
      initialValues={initialValues}
      isSaving={createRestaurant.isPending || updateRestaurant.isPending}
      onSave={handleSave}
    />
  )
}
