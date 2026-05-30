import { FaCheckCircle, FaClipboardList, FaClock, FaTimesCircle, FaTruck } from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";

type Props = {
  status: string;
};

export default function OrderStatusMessage({ status }: Props) {
  if (status === "placed") {
    return (
      <div className="text-red-500 text-2xl flex items-center">
        <FaClipboardList className="mr-2" />
        <span>Recibida</span>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="text-orange-500 text-2xl flex items-center">
        <FaClock className="mr-2" />
        <span>Esperando confirmación del restaurante</span>
      </div>
    );
  }

  if (status === "inProgress") {
    return (
      <div className="text-yellow-500 text-2xl flex items-center">
        <FaKitchenSet className="mr-2" />
        <span>En proceso</span>
      </div>
    );
  }

  if (status === "outForDelivery") {
    return (
      <div className="text-green-300 text-2xl flex items-center">
        <FaTruck className="mr-2" />
        <span>En reparto</span>
      </div>
    );
  }

  if (status === "delivered") {
    return (
      <div className="text-green-500 text-2xl flex items-center">
        <FaCheckCircle className="mr-2" />
        <span>Entregada</span>
      </div>
    );
  }

  return (
    <div className="text-red-500 text-2xl flex items-center">
      <FaTimesCircle className="mr-2" />
      <span>Estado inválido</span>
    </div>
  );
}
