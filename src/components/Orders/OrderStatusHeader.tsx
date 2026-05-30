import type { Order } from "@/api/types";
import { Progress } from "@/components/ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import OrderStatusMessage from "./OrderStatusMessage";

type Props = {
  order: Order;
};

export default function OrderStatusHeader({ order }: Props) {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + parseInt(order.restaurant.estimatedDeliveryTime)
    );
    const hours = created.getHours();
    const minutes = created.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((status) => status.value === order.status) ||
      ORDER_STATUS[0]
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between items-start md:items-center">
        <span className="flex items-center gap-2 flex-wrap">
          Order Status:
          <OrderStatusMessage status={getOrderStatusInfo()?.value || "placed"} />
        </span>
        <span>Expected by: {getExpectedDelivery()}</span>
      </h1>
      <Progress
        className="animate-pulse border-orange-500 border-2 mt-4"
        value={getOrderStatusInfo()?.progressiveValue || 0}
      />
    </>
  );
}
