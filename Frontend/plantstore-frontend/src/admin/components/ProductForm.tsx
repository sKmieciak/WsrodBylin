import { useEffect, useState } from "react";
import { fetchCategories } from "../Api/productApi";
import TextInput from "./form/TextInput";
import TextArea from "./form/TextArea";
import NumberInput from "./form/NumberInput";
import FileInput from "./form/FileInput";
import SelectInput from "./form/SelectInput";
import type { ProductDto } from "../../types/ProductDto";

type Props = {
  defaultValues?: ProductDto;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  disabled?: boolean;
};

export default function ProductForm({ defaultValues, onSubmit, onCancel, disabled }: Props) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [description, setDescription] = useState(defaultValues?.description || "");
  const [price, setPrice] = useState(defaultValues?.price || 0);
  const [inStock, setInStock] = useState(defaultValues?.inStock || 0);
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("inStock", inStock.toString());
    formData.append("categoryId", categoryId.toString());
    if (imageFile) formData.append("image", imageFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-sm text-gray-800">
      <TextInput label="Nazwa" value={name} onChange={setName} required />
      <TextArea label="Opis" value={description} onChange={setDescription} required />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput label="Cena" value={price} onChange={setPrice} required />
        <NumberInput label="Stan magazynowy" value={inStock} onChange={setInStock} required />
      </div>

      <FileInput label="Zdjęcie" onChange={setImageFile} />

      <SelectInput
        label="Kategoria"
        value={categoryId}
        onChange={setCategoryId}
        options={categories}
        required
      />

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Zapisz
        </button>
      </div>
    </form>
  );
}
