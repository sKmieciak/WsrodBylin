import { useEffect, useState } from "react";
import { fetchCategories } from "../../Api/productApi";
import TextInput from "../form/TextInput";
import TextArea from "../form/TextArea";
import NumberInput from "../form/NumberInput";
import FileInput from "../form/FileInput";
import SelectInput from "../form/SelectInput";
import type { ProductDto } from "../../../types/ProductDto";

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setCategoriesLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId === 0) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("inStock", inStock.toString());
    formData.append("categoryId", categoryId.toString());

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

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

      {defaultValues && (defaultValues.imageUrls?.length > 0 || defaultValues.defaultImageUrl) && imageFiles.length === 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Aktualne zdjęcia</p>
          <div className="flex flex-wrap gap-2">
            {(defaultValues.imageUrls?.length > 0 ? defaultValues.imageUrls : [defaultValues.defaultImageUrl!]).map((url, i) => (
              <img key={i} src={url} alt={`Zdjęcie ${i + 1}`} className="h-20 w-20 object-cover rounded border" />
            ))}
          </div>
        </div>
      )}
      <FileInput label={defaultValues ? "Nowe zdjęcia (zostaw puste aby zachować obecne)" : "Zdjęcia"} onChange={setImageFiles} />

      {categoriesLoading ? (
        <p className="text-sm text-gray-500">Ładowanie kategorii...</p>
      ) : (
        <SelectInput
          label="Kategoria"
          value={categoryId}
          onChange={setCategoryId}
          options={categories}
          required
        />
      )}

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
          disabled={disabled || categoriesLoading || categoryId === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          Zapisz
        </button>
      </div>
    </form>
  );
}
