import {
  useCreateRestaurante,
  useGetRestaurante,
  useUpdateRestaurante,
} from "@/api/RestauranteApi";
import ManageRestaurantForm from "@/forms/manage-restaurant-form/ManageRestaurantForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderItemsCard from "@/components/Orders/OrderItemsCard";
import { useGetRestaurantOrders } from "@/api/OrderApi";

export default function ManageRestaurantPage() {
  const createRestauranteRequest = useCreateRestaurante();
  const { data: restaurante, isLoading } = useGetRestaurante();
  const updateRestauranteRequest = useUpdateRestaurante();
  const { data: orders } = useGetRestaurantOrders();

  const isEditing = !!restaurante;

  return (
    <Tabs defaultValue="orders">
      <TabsList className="mb-4">
        <TabsTrigger
          value="orders"
          className="border-orange-500 hover:bg-orange-500 aria-selected:bg-orange-500 aria-selected:text-white border-2 mr-2 px-4 py-2 rounded font-bold cursor-pointer transition-colors duration-200"
        >
          Ordenes
        </TabsTrigger>
        <TabsTrigger
          value="manage-restaurant"
          className="border-orange-500 hover:bg-orange-500 aria-selected:bg-orange-500 aria-selected:text-white border-2 mr-2 px-4 py-2 rounded font-bold cursor-pointer transition-colors duration-200"
        >
          Administrar restaurante
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orders">
        <h2 className="text-2xl font-bold mb-4">Ordenes recibidas ({orders?.length || 0})</h2>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <OrderItemsCard key={order._id} order={order} />
          ))
        ) : (
          <p className="text-gray-500">No hay ordenes recibidas para este restaurante aún.</p>
        )}
      </TabsContent>

      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurante={restaurante}
          onSave={
            isEditing
              ? updateRestauranteRequest.mutate
              : createRestauranteRequest.mutate
          }
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
