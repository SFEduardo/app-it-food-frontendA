import { z } from "zod"
import { createFormSchema, updateFormSchema } from "./RestaurantFormSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import DetailsSection from "./DetailsSection"
import { Separator } from "@/components/ui/separator"
import CuisinesSection from "./CuisinesSection"
import MenuSection from "./MenuSection"
import ImageSection from "./ImageSection"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import type { Restaurante } from "@/api/types"
import { useEffect } from "react"

type Props = {
  restaurante?: Restaurante
  onSave: (restaurantFormData: FormData) => void
  isLoading: boolean
}
export type RestaurantFormData =
  | z.infer<typeof createFormSchema>
  | z.infer<typeof updateFormSchema>

export default function ManageRestaurantForm({
  restaurante,
  onSave,
  isLoading,
}: Props) {
  const schema = restaurante ? updateFormSchema : createFormSchema
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      restauranteName: "",
      city: "",
      country: "",
      deliverPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  })
  useEffect(() => {
    if (!restaurante) {
      return
    }
    const deliveryPriceFormatted = Number(restaurante.deliverPrice)
    const estimatedDeliveryTimeFormatted = Number(
      restaurante.estimatedDeliveryTime
    )
    const updateRestaurante = {
      ...restaurante,
      deliverPrice: Number.isFinite(deliveryPriceFormatted)
        ? deliveryPriceFormatted
        : 0,
      estimatedDeliveryTime: Number.isFinite(estimatedDeliveryTimeFormatted)
        ? estimatedDeliveryTimeFormatted
        : 0,
    }
    form.reset(updateRestaurante)
  }, [form, restaurante])
  const onSubmit = (formDataJson: RestaurantFormData) => {
    // console.log(formData);
    const formData = new FormData()

    formData.append("restauranteName", formDataJson.restauranteName)
    formData.append("city", formDataJson.city)
    formData.append("country", formDataJson.country)
    formData.append("deliverPrice", formDataJson.deliverPrice.toString())
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString()
    )
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine)
    })
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name)
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString())
    })
    if (formDataJson.imageFile) {
      formData.append("imageFile", formDataJson.imageFile)
    }
    onSave(formData)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded-lg bg-gray-50 p-10"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button className="bg-black text-white" type="submit">
            Guardar
          </Button>
        )}
      </form>
    </Form>
  )
}
