import axios from "axios";
import type { CreateAddressDto, AddressDto } from "../types/Adress";

export const getAddresses = async (): Promise<AddressDto[]> => {
  const res = await axios.get("/api/user/addresses");
  return res.data;
};

export const createAddress = async (data: CreateAddressDto): Promise<AddressDto> => {
  const res = await axios.post("/api/user/addresses", data);
  return res.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await axios.delete(`/api/user/addresses/${id}`);
};
