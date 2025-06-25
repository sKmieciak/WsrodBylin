import { useEffect, useState } from "react";
import { getAddresses, createAddress, deleteAddress } from "../api/addressApi";
import type { AddressDto, CreateAddressDto } from "../types/Adress";

export const useUserAddresses = () => {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getAddresses();
    setAddresses(data);
    setLoading(false);
  };

  const add = async (dto: CreateAddressDto) => {
    await createAddress(dto);
    await fetch();
  };

  const remove = async (id: number) => {
    await deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    fetch();
  }, []);

  return { addresses, loading, add, remove };
};
