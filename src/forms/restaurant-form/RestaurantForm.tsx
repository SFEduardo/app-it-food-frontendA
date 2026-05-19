"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { BackEndRestaurant } from "@/api/types"
import { useEffect } from "react"
import { restaurantCuisineOptions } from "@/config/restaurant-options-config"

const baseSchema = z.object({
  restaurantName: z.string().min(1, "El nombre del restaurante es requerido"),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
  deliveryPrice: z
    .number()
    .min(0, "El precio de entrega debe ser un número positivo"),
  estimatedDeliveryTime: z
    .number()
    .min(0, "El tiempo de entrega debe ser un número positivo"),
  cuisines: z
    .array(z.string().min(1, "Agrega al menos una cocina"))
    .min(1, "El arreglo de cocinas no puede estar vacío"),
  menuItems: z
    .array(
      z.object({
        name: z.string().min(1, "El nombre del platillo es requerido"),
        price: z
          .number()
          .min(0, "El precio del platillo debe ser un número positivo"),
      })
    )
    .min(1, "Se requiere al menos un platillo"),
})

const createRestaurantSchema = baseSchema.extend({
  imageFile: z
    .any()
    .refine(
      (value) => value instanceof FileList && value.length > 0,
      "La imagen del restaurante es requerida"
    ),
})

const updateRestaurantSchema = baseSchema.extend({
  imageFile: z.any().optional(),
})

export type RestaurantFormValues = z.infer<typeof updateRestaurantSchema>

type Props = {
  onSave: (data: RestaurantFormValues) => void
  initialValues?: BackEndRestaurant
  isSaving: boolean
}

export default function RestaurantForm({
  onSave,
  initialValues,
  isSaving,
}: Props) {
  const isEdit = Boolean(initialValues)

  const form = useForm<RestaurantFormValues>({
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      deliveryPrice: 0,
      estimatedDeliveryTime: 0,
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
      imageFile: undefined,
    },
    resolver: zodResolver(
      isEdit ? updateRestaurantSchema : createRestaurantSchema
    ),
    mode: "onSubmit",
  })

  const menuItemsFieldArray = useFieldArray({
    control: form.control,
    name: "menuItems",
  })

  useEffect(() => {
    if (initialValues) {
      form.reset({
        restaurantName: initialValues.restaurantName,
        city: initialValues.city,
        country: initialValues.country,
        deliveryPrice: initialValues.deliveryPrice,
        estimatedDeliveryTime: initialValues.estimatedDeliveryTime,
        cuisines: initialValues.cuisines.length ? initialValues.cuisines : [],
        menuItems:
          initialValues.menuItems.length > 0
            ? initialValues.menuItems
            : [{ name: "", price: 0 }],
        imageFile: undefined,
      })
    }
  }, [initialValues, form])

  const onSubmit = (data: RestaurantFormValues) => {
    onSave(data)
  }

  return (
    <Card>
      <form
        id="restaurant-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-gray-50 p-6"
      >
        <CardHeader>
          <CardTitle>
            {isEdit ? "Editar Restaurante" : "Formulario para Restaurante"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Actualiza la información de tu restaurante y el menú."
              : "Ingresa los datos de tu restaurante, agrega las cocinas y los platillos."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup>
              <Field
                data-invalid={form.formState.errors.restaurantName != null}
              >
                <FieldLabel>Nombre del restaurante</FieldLabel>
                <Input
                  {...form.register("restaurantName")}
                  id="restaurantName"
                  placeholder="Ej. La Casa del Taco"
                />
                <FieldError errors={[form.formState.errors.restaurantName]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field data-invalid={form.formState.errors.city != null}>
                <FieldLabel>Ciudad</FieldLabel>
                <Input
                  {...form.register("city")}
                  id="city"
                  placeholder="Ej. Guadalajara"
                />
                <FieldError errors={[form.formState.errors.city]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field data-invalid={form.formState.errors.country != null}>
                <FieldLabel>País</FieldLabel>
                <Input
                  {...form.register("country")}
                  id="country"
                  placeholder="Ej. México"
                />
                <FieldError errors={[form.formState.errors.country]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field data-invalid={form.formState.errors.deliveryPrice != null}>
                <FieldLabel>Precio de entrega</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("deliveryPrice", { valueAsNumber: true })}
                  id="deliveryPrice"
                  placeholder="Ej. 30"
                />
                <FieldError errors={[form.formState.errors.deliveryPrice]} />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field
                data-invalid={
                  form.formState.errors.estimatedDeliveryTime != null
                }
              >
                <FieldLabel>Tiempo estimado de entrega (min)</FieldLabel>
                <Input
                  type="number"
                  step="1"
                  {...form.register("estimatedDeliveryTime", {
                    valueAsNumber: true,
                  })}
                  id="estimatedDeliveryTime"
                  placeholder="Ej. 25"
                />
                <FieldError
                  errors={[form.formState.errors.estimatedDeliveryTime]}
                />
              </Field>
            </FieldGroup>
          </div>

          <div className="space-y-4 rounded-xl border border-orange-200 bg-white p-4">
            <div>
              <h3 className="text-lg font-semibold">Cocinas</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona el tipo de cocina que el restaurante servirá.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {restaurantCuisineOptions.map((cuisine) => {
                const currentValue = form.watch("cuisines") ?? []
                const isChecked = currentValue.includes(cuisine)

                return (
                  <label
                    key={cuisine}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      isChecked
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        const previous: string[] =
                          form.getValues("cuisines") ?? []
                        const next = event.target.checked
                          ? [...previous, cuisine]
                          : previous.filter((item) => item !== cuisine)
                        form.setValue("cuisines", next)
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span>{cuisine}</span>
                  </label>
                )
              })}
            </div>
            <FieldError errors={[form.formState.errors.cuisines]} />
          </div>

          <div className="space-y-4 rounded-xl border border-orange-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Menú</h3>
                <p className="text-sm text-muted-foreground">
                  Ingresa los platillos disponibles y su precio.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  menuItemsFieldArray.append({ name: "", price: 0 })
                }
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Agregar platillo
              </Button>
            </div>
            <div className="space-y-3">
              {menuItemsFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[2fr_1fr_auto]"
                >
                  <div>
                    <Field
                      data-invalid={Boolean(
                        form.formState.errors.menuItems?.[index]?.name
                      )}
                    >
                      <FieldLabel>Platillo</FieldLabel>
                      <Input
                        {...form.register(`menuItems.${index}.name` as const)}
                        placeholder="Ej. Tacos al pastor"
                      />
                      <FieldError
                        errors={
                          form.formState.errors.menuItems?.[index]?.name
                            ? [
                                {
                                  message:
                                    form.formState.errors.menuItems?.[index]
                                      ?.name?.message,
                                },
                              ]
                            : undefined
                        }
                      />
                    </Field>
                  </div>
                  <div>
                    <Field
                      data-invalid={Boolean(
                        form.formState.errors.menuItems?.[index]?.price
                      )}
                    >
                      <FieldLabel>Precio</FieldLabel>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register(`menuItems.${index}.price` as const, {
                          valueAsNumber: true,
                        })}
                        placeholder="Ej. 45"
                      />
                      <FieldError
                        errors={
                          form.formState.errors.menuItems?.[index]?.price
                            ? [
                                {
                                  message:
                                    form.formState.errors.menuItems?.[index]
                                      ?.price?.message,
                                },
                              ]
                            : undefined
                        }
                      />
                    </Field>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => menuItemsFieldArray.remove(index)}
                    className="h-fit self-end p-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.imageFile)}>
              <FieldLabel>Imagen del restaurante</FieldLabel>
              <input
                type="file"
                accept="image/*"
                {...form.register("imageFile")}
                className="rounded border border-slate-300 bg-white p-2"
              />
              {initialValues?.imageUrl && (
                <img
                  src={initialValues.imageUrl}
                  alt="Imagen del restaurante"
                  className="mt-3 max-h-56 w-full rounded object-cover"
                />
              )}
              <FieldError errors={[form.formState.errors.imageFile]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {isEdit
                ? "Guarda los cambios cuando termines de editar tu restaurante."
                : "Ingresa la información básica y el menú para crear tu restaurante."}
            </p>
          </div>
          <Button type="submit" form="restaurant-form" disabled={isSaving}>
            {isSaving
              ? "Guardando..."
              : isEdit
                ? "Actualizar restaurante"
                : "Crear restaurante"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
