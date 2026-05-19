import {
  useCreateRestaurante,
  useGetRestaurante,
  useUpdateRestaurante,
} from "@/api/RestauranteApi"
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm"

export default function ManageRestaurantPage() {
  const createRestauranteRequest = useCreateRestaurante()
  const updateRestauranteRequest = useUpdateRestaurante()
  const { data: restaurante, isLoading: isLoadingRestaurante } =
    useGetRestaurante()
  const isLoading =
    isLoadingRestaurante ||
    createRestauranteRequest.isLoading ||
    updateRestauranteRequest.isLoading
  const onSave = restaurante
    ? updateRestauranteRequest.mutate
    : createRestauranteRequest.mutate

  return (
    <ManageRestaurantForm
      restaurante={restaurante}
      onSave={onSave}
      isLoading={isLoading}
    />
  )
}
