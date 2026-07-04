import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { updateUser } from "../../api/userApi";
import CheckoutCartItems from "../../components/Checkout/CheckoutCartItems";
import CheckoutAddressForm, { type AddressData } from "../../components/Checkout/CheckoutAddressForm";
import CheckoutDeliveryMethod from "../../components/Checkout/CheckoutDeliveryMethod";
import CheckoutPaymentMethod from "../../components/Checkout/CheckoutPaymentMethod";
import { createOrder } from "../../api/orderApi";

const deliveryOptions = [
  { label: "Paczkomaty InPost", price: 21, note: "Cena dla paczek do 16 szt." },
  { label: "Kurier InPost", price: 26, note: "Dostawa pod wskazany adres, paczki do 16 szt." },
  { label: "Odbiór osobisty", price: 0 },
];

const paymentOptions = [
  { label: "Przelew tradycyjny" },
  { label: "Przelew na telefon (BLIK)" },
];

const STEPS = ["Koszyk", "Dane", "Płatność"];

const emptyAddress: AddressData = {
  firstName: "", lastName: "", email: "", phoneNumber: "",
  street: "", houseNumber: "", postalCode: "", city: "",
  country: "Polska", addressAddon: "",
};

export default function CheckoutPage() {
  const { cart, clearCart, updateItem, removeItem } = useCart();
  const { user: authUser } = useAuth();
  const { user: profileUser, loading: profileLoading } = useUser();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<AddressData>(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
  const [paczkomatPoint, setPaczkomatPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  // Pre-fill for logged-in users
  useEffect(() => {
    if (profileUser) {
      setAddress({
        firstName: profileUser.firstName || "",
        lastName: profileUser.lastName || "",
        email: profileUser.email || "",
        phoneNumber: profileUser.phone || "",
        street: profileUser.street || "",
        houseNumber: profileUser.houseNumber || "",
        postalCode: profileUser.postalCode || "",
        city: profileUser.city || "",
        country: profileUser.country || "Polska",
        addressAddon: profileUser.addressAddon || "",
      });
    }
  }, [profileUser]);

  const isPaczkomatSelected = selectedDelivery.label === "Paczkomaty InPost";

  const isAddressValid = () =>
    address.firstName.trim() && address.lastName.trim() &&
    address.email.trim() && address.phoneNumber.trim() &&
    address.street.trim() && address.houseNumber.trim() &&
    address.postalCode.trim() && address.city.trim();

  const isDeliveryValid = () =>
    !isPaczkomatSelected || paczkomatPoint.trim() !== "";

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // Optionally save address to profile for logged-in users
      if (authUser && saveAddress && profileUser) {
        await updateUser({
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          phoneNumber: address.phoneNumber,
          street: address.street,
          houseNumber: address.houseNumber,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country,
          addressAddon: address.addressAddon,
          isCompanyAccount: profileUser.isCompanyAccount ?? false,
        });
      }

      const response = await createOrder({
        courier: selectedDelivery.label,
        paymentMethod: selectedPayment.label,
        deliveryCost: selectedDelivery.price,
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingFirstName: address.firstName,
        shippingLastName: address.lastName,
        shippingEmail: address.email,
        shippingPhone: address.phoneNumber,
        shippingStreet: address.street,
        shippingHouseNumber: address.houseNumber,
        shippingPostalCode: address.postalCode,
        shippingCity: address.city,
        shippingCountry: address.country,
        paczkomatPoint: paczkomatPoint || undefined,
      });

      await clearCart();
      navigate(`/order/success/${response.id}`, {
        state: {
          paymentMethod: selectedPayment.label,
          total: cartTotal + selectedDelivery.price,
        },
      });
    } catch {
      setError("Błąd przy składaniu zamówienia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((s, i) => s + i.productPrice * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32 md:pb-8">
      {/* Step tabs */}
      <div className="flex gap-0 border-b border-gray-300 mb-8">
        {STEPS.map((label, i) => (
          <button
            key={label}
            disabled={i > step}
            onClick={() => i < step && setStep(i)}
            className={`px-5 py-3 text-sm font-medium border-b-4 transition-colors ${
              i === step
                ? "border-green-600 text-green-700"
                : i < step
                ? "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                : "border-transparent text-gray-300 cursor-default"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {/* Step 0 — Cart */}
      {step === 0 && (
        <>
          <CheckoutCartItems cart={cart} updateItem={updateItem} removeItem={removeItem} />
          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-lg"
            >
              Dalej
            </button>
          </div>
        </>
      )}

      {/* Step 1 — Address */}
      {step === 1 && (
        <>
          {profileLoading && authUser ? (
            <div className="text-center py-10 text-gray-500">Ładowanie danych...</div>
          ) : (
            <>
              <CheckoutAddressForm data={address} onChange={setAddress} />

              {authUser && (
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-6 -mt-4">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-green-600"
                  />
                  Zapisz dane do mojego konta
                </label>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(0)} className="text-gray-500 underline hover:text-gray-700">
                  Wróć
                </button>
                <button
                  disabled={!isAddressValid()}
                  onClick={() => setStep(2)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-lg disabled:opacity-40"
                >
                  Dalej
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Step 2 — Delivery + Payment */}
      {step === 2 && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <CheckoutDeliveryMethod
              deliveryOptions={deliveryOptions}
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={(opt) => { setSelectedDelivery(opt); setPaczkomatPoint(""); }}
              paczkomatPoint={paczkomatPoint}
              onPaczkomatPointChange={(code) => setPaczkomatPoint(code)}
            />
            <CheckoutPaymentMethod
              paymentOptions={paymentOptions}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
          </div>

          <div className="bg-gray-50 border rounded-xl p-5 mb-6 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Produkty</span>
              <span>{cartTotal.toFixed(2)} zł</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dostawa ({selectedDelivery.label})</span>
              <span>{selectedDelivery.price > 0 ? `${selectedDelivery.price.toFixed(2)} zł` : "Bezpłatna"}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>Łącznie</span>
              <span className="text-green-700">{(cartTotal + selectedDelivery.price).toFixed(2)} zł</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mb-4 text-right">{error}</p>}

          <div className="flex justify-between items-center">
            <button onClick={() => setStep(1)} className="text-gray-500 underline hover:text-gray-700" disabled={loading}>
              Wróć
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isDeliveryValid()}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-semibold text-lg disabled:opacity-60"
            >
              {loading ? "Składanie zamówienia..." : "Złóż zamówienie"}
            </button>
          </div>
        </>
      )}

      {/* Mobile sticky bar on last step */}
      {step === 2 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-[60]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">
              Suma: <span className="text-green-600">{(cartTotal + selectedDelivery.price).toFixed(2)} zł</span>
            </span>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isDeliveryValid()}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-60"
            >
              {loading ? "Składanie..." : "Złóż zamówienie"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
