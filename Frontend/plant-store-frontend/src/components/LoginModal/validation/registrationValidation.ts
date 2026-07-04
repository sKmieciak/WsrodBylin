interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export function validateRegistration(data: RegistrationData): string | null {
  if (!data.name) return "Imię i nazwisko jest wymagane.";
  if (!data.email) return "Email jest wymagany.";
  if (!/\S+@\S+\.\S+/.test(data.email)) return "Niepoprawny format email.";
  if (!data.phone) return "Numer telefonu jest wymagany.";
  if (!/^\+?[0-9\s\-]{7,15}$/.test(data.phone)) return "Niepoprawny numer telefonu.";
  if (!data.address) return "Adres zamieszkania jest wymagany.";
  if (!data.password) return "Hasło jest wymagane.";
  if (data.password.length < 6) return "Hasło musi mieć minimum 6 znaków.";
  return null;
}
