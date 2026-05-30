import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useUpdateRestauranteOrder } from "@/api/OrderApi";

type Props = {
  order: Order;
};

export default function OrderItemsCard({ order }: Props) {
  const { mutate: updateOrderStatus, isPending } = useUpdateRestauranteOrder();
  const [status, setStatus] = useState<OrderStatus>(order.status);

  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    updateOrderStatus({ orderId: order._id, status: newStatus });
    setStatus(newStatus);
  };

  const getTime = () => {
    const orderDateTime = new Date(order.createdAt);
    const hours = orderDateTime.getHours();
    const minutes = orderDateTime.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-4 justify-between mb-3 text-base font-bold">
          <div>
            Nombre del cliente:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.name}
            </span>
          </div>
          <div>
            Dirección de entrega:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.address}, {order.deliveryDetails.city}
            </span>
          </div>
          <div>
            Tiempo de entrega:
            <span className="ml-2 font-normal">{getTime()}</span>
          </div>
          <div>
            Costo total:
            <span className="ml-2 font-normal">
              ${(order.totalAmount / 100).toFixed(2)}
            </span>
          </div>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((cartItem, key) => (
            <span key={key} className="flex items-center gap-2">
              <Badge variant="outline" className="mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name}
            </span>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col space-y-1.5 mt-2">
          <Label htmlFor="status">¿Cuál es el estatus de la orden?</Label>
          <Select
            value={status}
            onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            disabled={isPending}
          >
            <SelectTrigger id="status" className="w-full max-w-[300px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUS.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
