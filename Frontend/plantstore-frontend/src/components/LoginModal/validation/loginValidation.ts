interface LoginData {
  email: string;
  password: string;
}

export function validateLogin(data: LoginData): string | null {
  if (!data.email) return "Email jest wymagany.";
  if (!/\S+@\S+\.\S+/.test(data.email)) return "Niepoprawny format email.";
  if (!data.password) return "Hasło jest wymagane.";
  if (data.password.length < 6) return "Hasło musi mieć minimum 6 znaków.";
  return null;
}
