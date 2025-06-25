import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutCartItems from "../../components/Checkout/CheckoutCartItems";
import CheckoutDeliveryMethod from "../../components/Checkout/CheckoutDeliveryMethod";
import CheckoutPaymentMethod from "../../components/Checkout/CheckoutPaymentMethod";
import CheckoutSummaryActions from "../../components/Checkout/CheckoutSummaryActions";
import { createOrder, createStripeSession } from "../../api/orderApi";

const stripePromise = loadStripe("pk_test_51RdUlgB7o6jJtvCqMmBMKZfwRdrFGqVFwrVqWXjsijSPs8LML6TBt5ECUOaTHBV5Nv6eSVQuerjGu3yl7xYmoP8700hOPUuctl"); 

const deliveryOptions = [
  { label: "Paczkomaty InPost", price: 19, note: "Brakuje Ci 244,01 PLN do darmowej wysyłki" },
  { label: "Kurier InPost", price: 31, note: "Brakuje Ci 244,01 PLN do darmowej wysyłki" },
  { label: "Odbiór osobisty", price: 0 },
];

const paymentOptions = [
  { label: "Przelew" },
  { label: "Szybkie płatności internetowe Tpay" },
];

export default function CheckoutPage() {
  const { cart, clearCart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);

  const handlePlaceOrder = async () => {
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const response = await createOrder({
        courier: selectedDelivery.label,
        paymentMethod: selectedPayment.label,
        items,
      });

      const orderId = response.id;

      if (selectedPayment.label.includes("Tpay")) {
        const stripeData = await createStripeSession(cart);
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: stripeData.sessionId });
      } else {
        await clearCart();
        navigate(`/order/success/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Błąd przy składaniu zamówienia.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex gap-6 border-b border-gray-300 mb-8 text-lg font-medium">
        <div className="pb-2 border-b-4 border-black">Koszyk</div>
        <div className="text-gray-400">Dane</div>
        <div className="text-gray-400">Płatność</div>
      </div>

      <CheckoutCartItems
        cart={cart}
        updateItem={updateItem}
        removeItem={removeItem}
      />

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <CheckoutDeliveryMethod
          deliveryOptions={deliveryOptions}
          selectedDelivery={selectedDelivery}
          setSelectedDelivery={setSelectedDelivery}
        />
        <CheckoutPaymentMethod
          paymentOptions={paymentOptions}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
        />
      </div>

      <CheckoutSummaryActions
        handlePlaceOrder={handlePlaceOrder}
        navigate={navigate}
      />
    </div>
  );
}
