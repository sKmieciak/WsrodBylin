# PlantStore — Code Review

> Przegląd backendu (.NET 8) i frontendu (React 19 + TypeScript).
> Data: 2026-04-03

---

## Legenda priorytetów

- **[KRYTYCZNE]** — błąd bezpieczeństwa lub defekt blokujący produkcję
- **[WYSOKIE]** — poważny bug lub brak ważnej funkcji
- **[ŚREDNIE]** — duplikacja, brak spójności, jakość kodu
- **[NISKIE]** — optymalizacje, dług techniczny, nice-to-have

---

## KRYTYCZNE — Bezpieczeństwo

---

### K-1: Sekrety w plaintext w `appsettings.json`

**Plik:** `Backend/PlantStore.Api/appsettings.json`

```json
// linia 41
"Key": "super_secure_key_1234567890_abcd1234xyz!"

// linia 46
"DefaultConnection": "Server=217.154.229.232,1433;Database=WsrodBylin_Prod;User Id=sa;Password=Wsrod@Bylin!#;"

// linia 50
"ApiToken": "Wsrod@Bylin#$!superTajnyToken@##$"
```

**Problem:** JWT secret, hasło do produkcyjnego SQL Servera (konto `sa`!) i token Furgonetki są jawnie w pliku konfiguracyjnym. Jeśli repozytorium jest kiedykolwiek publiczne lub wycieknie — atakujący ma pełny dostęp do bazy i API.

**Fix:**
1. Usuń sekrety z `appsettings.json` (zostaw tylko puste placeholdery lub `""`)
2. Użyj zmiennych środowiskowych na serwerze:
   ```bash
   # na serwerze / w docker-compose / w CI
   ConnectionStrings__DefaultConnection=Server=...
   Jwt__Key=<losowy_string_min_32_znaki>
   Furgonetka__ApiToken=<token>
   ```
3. W kodzie .NET środowisko automatycznie nadpisze `appsettings.json` — bez zmian w kodzie
4. Klucz JWT musi mieć minimum 32 znaki (256 bitów) — obecny ma ~40, ale powinien być losowy
5. Użytkownik bazy danych **nie powinien być `sa`** — stwórz dedykowane konto z uprawnieniami tylko do tej bazy

---

### K-2: Dane wrażliwe w plikach `.env` frontendowych

**Pliki:**
- `Frontend/plant-store-frontend/.env.development`
- `Frontend/plant-store-frontend/.env.production`

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_BANK_ACCOUNT_NUMBER=...
VITE_BANK_ACCOUNT_OWNER=Magdalena Banasiak   # imię i nazwisko osoby prywatnej
```

**Problem:** Pliki `.env` trafiają do repozytorium. Zmienne `VITE_*` są **bundle'owane do kodu JS** — każdy odwiedzający stronę może je zobaczyć w narzędziach devtools. Imię i nazwisko osoby prywatnej nie powinno być w kodzie.

**Fix:**
1. Dodaj `.env.development` i `.env.production` do `.gitignore` (jeśli jeszcze nie są)
2. Stwórz `.env.example` z pustymi wartościami jako dokumentacja
3. Klucz Stripe publishable key jest z natury publiczny — można go zostawić, ale i tak nie w repozytorium
4. Dane przelewu (numer konta, właściciel) przenieś do komponentu lub konfiguracji backendowej — nie do `.env`

---

### K-3: Hardkodowany placeholder API key w `FurgonetkaShippingService.cs`

**Plik:** `Backend/PlantStore.Api/Services/FurgonetkaShippingService.cs`

```csharp
// linia ~11 (wewnątrz konstruktora lub metody)
private const string ApiKey = "TWOJ_API_KEY"; // TODO
```

**Problem:** Serwis jest zarejestrowany w DI i wywoływany — ale wysyła zapytania z niepoprawnym kluczem. Generowanie etykiet zawsze się nie uda. Prawdziwy token z K-1 nie jest tu używany.

**Fix:**
```csharp
// ServicesConfiguration.cs — już dodane, ale upewnij się że serwis używa IOptions
services.Configure<FurgonetkaOptions>(configuration.GetSection("Furgonetka"));

// FurgonetkaShippingService.cs
public class FurgonetkaShippingService
{
    private readonly string _apiToken;

    public FurgonetkaShippingService(IOptions<FurgonetkaOptions> options)
    {
        _apiToken = options.Value.ApiToken;
    }
}
```

---

### K-4: JWT przechowywany w `localStorage` (podatność XSS)

**Plik:** `Frontend/plant-store-frontend/src/context/AuthContext.tsx`

```tsx
// localStorage jest dostępny dla każdego skryptu JS na stronie
localStorage.setItem("token", token);
const token = localStorage.getItem("token");
```

**Problem:** Jeśli aplikacja ma lukę XSS (np. przez bibliotekę zewnętrzną), atakujący może wykraść token i działać jako zalogowany użytkownik.

**Fix (opcja A — łatwiejsza):** Zmień na `sessionStorage` — token znika po zamknięciu karty, mniejsze okno ataku.

**Fix (opcja B — właściwa):** Przejdź na httpOnly cookies — token jest wysyłany automatycznie przez przeglądarkę i **niedostępny** dla JS:
```csharp
// Backend — AuthController.cs: zwracaj token jako httpOnly cookie
Response.Cookies.Append("token", jwtToken, new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = DateTime.UtcNow.AddDays(7)
});
```
```tsx
// Frontend — usuń ręczne zarządzanie tokenem, Axios będzie automatycznie wysyłał cookie
// W axios instance ustaw: withCredentials: true
```

---

## WYSOKIE

---

### H-1: Brak walidacji siły hasła przy rejestracji

**Plik:** `Backend/PlantStore.Api/DTOs/UserRegisterDto.cs`

```csharp
// brak jakichkolwiek reguł na Password
public string Password { get; set; }
```

**Problem:** Można się zarejestrować z hasłem `a` lub `1`.

**Fix:** Użyj FluentValidation (projekt już go ma):
```csharp
// UserRegisterDtoValidator.cs (nowy plik)
public class UserRegisterDtoValidator : AbstractValidator<UserRegisterDto>
{
    public UserRegisterDtoValidator()
    {
        RuleFor(x => x.Password)
            .MinimumLength(8).WithMessage("Hasło musi mieć minimum 8 znaków.")
            .Matches("[A-Z]").WithMessage("Hasło musi zawierać przynajmniej jedną wielką literę.")
            .Matches("[0-9]").WithMessage("Hasło musi zawierać przynajmniej jedną cyfrę.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Niepoprawny adres e-mail.");
    }
}
```

---

### H-2: CORS hardkodowany na `localhost:5173`

**Plik:** `Backend/PlantStore.Api/Configuration/ServicesConfiguration.cs`

```csharp
// linia ~37
builder.WithOrigins("http://localhost:5173")
```

**Problem:** Na produkcji CORS nie przepuszcza żądań z `https://wsrodbylin.pl` — frontend nie działa lub ktoś musiał to obejść inaczej.

**Fix:**
```json
// appsettings.json
"Cors": {
  "AllowedOrigins": ["http://localhost:5173"]
}

// appsettings.Production.json
"Cors": {
  "AllowedOrigins": ["https://wsrodbylin.pl"]
}
```
```csharp
// ServicesConfiguration.cs
var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.WithOrigins(allowedOrigins!);
```

---

### H-3: Potencjalny problem N+1 przy pobieraniu zamówień

**Plik:** `Backend/PlantStore.Api/Controllers/OrdersController.cs` (linia ~103-108)

**Problem:** Jeśli zamówienia są pobierane bez `Include()` dla `Items` i `Items.Product`, EF Core wykona osobne zapytanie SQL dla każdego zamówienia (N+1 queries).

**Fix — upewnij się że Include jest zawsze obecne:**
```csharp
var orders = await _context.Orders
    .Where(o => o.UserId == userId)
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)
    .AsNoTracking()   // <-- dodaj dla odczytów (read-only)
    .ToListAsync();
```
`AsNoTracking()` przyspiesza zapytania read-only (~20-30% szybciej dla dużych list).

---

### H-4: Brak paginacji w admin endpointach

**Plik:** `Backend/PlantStore.Api/Controllers/AdminOrdersController.cs` (linia ~31)

```csharp
var orders = await _context.Orders.Include(...).ToListAsync(); // wszystkie naraz
```

**Problem:** Przy 10k+ zamówieniach endpoint zwróci cały zestaw do pamięci — timeout lub OOM.

**Fix:**
```csharp
[HttpGet]
public async Task<IActionResult> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
{
    var orders = await _context.Orders
        .Include(o => o.Items).ThenInclude(i => i.Product)
        .AsNoTracking()
        .OrderByDescending(o => o.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    var total = await _context.Orders.CountAsync();

    return Ok(new { data = orders.Select(OrderMapper.ToDto), total, page, pageSize });
}
```

---

### H-5: Integracja Stripe całkowicie zakomentowana

**Plik:** `Backend/PlantStore.Api/Controllers/PaymentsController.cs` (204 linie, wszystkie w komentarzu)

**Problem:** Frontend zawiera `stripeService.ts` i logikę do płatności kartą, ale backend jest wyłączony. Użytkownicy widzą opcję ale nic nie działa.

**Fix — wybierz jedno:**
- **Opcja A:** Odkomentuj i dokończ integrację (konfiguracja kluczy, webhook endpoint z walidacją sygnatury)
- **Opcja B:** Usuń cały zakomentowany plik + frontend references do Stripe i uprość checkout do przelewu/BLIK

---

### H-6: Brak globalnego middleware do obsługi błędów

**Plik:** `Backend/PlantStore.Api/Program.cs`

**Problem:** Wyjątki powodują stack trace w odpowiedzi lub 500 bez struktury. Każdy kontroler ma własne try/catch z różnymi formatami błędów.

**Fix:**
```csharp
// Middleware/ExceptionHandlingMiddleware.cs
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Nieoczekiwany błąd: {Message}", ex.Message);
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { error = "Wystąpił błąd serwera." });
        }
    }
}

// Program.cs
app.UseMiddleware<ExceptionHandlingMiddleware>(); // przed innymi middleware
```

---

## ŚREDNIE

---

### S-1: Duplikacja logiki generowania etykiety kurierskiej

**Pliki:**
- `Backend/PlantStore.Api/Controllers/OrdersController.cs` (linia ~198-243)
- `Backend/PlantStore.Api/Controllers/AdminOrdersController.cs` (linia ~53-97)

**Problem:** Identyczna logika wywołania Furgonetka API jest skopiowana w dwóch miejscach.

**Fix:** Wyciągnij do serwisu — `IShippingService` już istnieje, przesuń logikę tam i wywołuj z obu kontrolerów.

---

### S-2: Niespójny wzorzec autoryzacji

**Problem:** Część kontrolerów używa `[Authorize(Roles = "Admin")]`, inne używają `[AdminOnly]` (custom atrybut sprawdzający claim "IsAdmin").

```csharp
// AdminOrdersController.cs
[Authorize(Roles = "Admin")]

// OrdersController.cs — niektóre akcje
[AdminOnly]
```

**Fix:** Wybierz jeden wzorzec i stosuj konsekwentnie. Rekomendacja: `[Authorize(Roles = "Admin")]` — jest standardowy, wspierany przez wszystkie narzędzia (.NET, Swagger). Usuń `AdminOnlyAttribute.cs`.

Upewnij się że przy logowaniu dodajesz claim roli:
```csharp
// AuthController.cs — przy generowaniu tokenu
new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
```

---

### S-3: Pusty plik `errorHandling.ts`

**Plik:** `Frontend/plant-store-frontend/src/utils/errorHandling.ts`

**Problem:** Plik istnieje ale jest pusty. Błędy API nie są obsługiwane spójnie — part komponentów ignoruje błędy, część loguje do konsoli.

**Fix:**
```typescript
// errorHandling.ts
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message
      ?? error.response?.data?.error
      ?? `Błąd ${error.response?.status ?? 'sieci'}.`;
  }
  if (error instanceof Error) return error.message;
  return 'Wystąpił nieoczekiwany błąd.';
}
```
Następnie używaj we wszystkich catch blokach zamiast hardkodowanych stringów.

---

### S-4: Duplikacja funkcji w `productsApi.ts`

**Plik:** `Frontend/plant-store-frontend/src/api/productsApi.ts`

```typescript
export const getProducts = async () => { ... };      // linia ~5
export const fetchProductById = async (id) => { ... }; // linia ~15
export const getProductById = async (id) => { ... };   // linia ~20 — duplikat
```

**Fix:** Usuń jeden z duplikatów (`fetchProductById` lub `getProductById`), zaktualizuj wszystkie importy.

---

### S-5: Magic strings "Admin" / "IsAdmin" rozrzucone po kodzie

**Problem:** Stringi `"Admin"`, `"IsAdmin"`, `"User"` pojawiają się w wielu plikach bez centralnej definicji.

**Fix:**
```csharp
// Backend/PlantStore.Api/Auth/Roles.cs
public static class Roles
{
    public const string Admin = "Admin";
    public const string User = "User";
}

public static class Claims
{
    public const string IsAdmin = "IsAdmin";
}
```
```typescript
// Frontend: src/constants/roles.ts
export const ROLES = { ADMIN: 'Admin', USER: 'User' } as const;
```

---

### S-6: Brak walidacji przy składaniu zamówienia z pustym koszykiem

**Plik:** `Frontend/plant-store-frontend/src/pages/checkout/CheckoutPage.tsx`

**Problem:** Użytkownik może przejść do checkout z pustym koszykiem i złożyć zamówienie `{ items: [] }`.

**Fix:**
```tsx
// Na początku komponentu lub przy nawigacji
useEffect(() => {
  if (cart.length === 0) {
    navigate('/cart');
  }
}, [cart]);
```
Walidacja powinna być też po stronie backendu — `OrdersController.cs` powinien zwracać 400 jeśli `items` jest puste.

---

### S-7: Brak refresh token — JWT wygasa po 7 dniach bez reakcji

**Plik:** `Backend/PlantStore.Api/Controllers/AuthController.cs` (linia ~148)

**Problem:** Po wygaśnięciu tokenu użytkownik dostaje 401, ale frontend nie obsługuje tego — nie wylogowuje go, nie odświeża. Token jest re-issued tylko przy kolejnym logowaniu.

**Fix (minimalny):** W Axios interceptor na froncie obsłuż 401 → wyloguj użytkownika i przekieruj na `/login`:
```typescript
// axiosInstance.ts
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## NISKIE

---

### N-1: Zakomentowany blok konfiguracji JSON serialization

**Plik:** `Backend/PlantStore.Api/Program.cs` (linia ~25-33)

```csharp
// .AddJsonOptions(options =>
// {
//     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
//     options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
// });
```

**Problem:** Bez `ReferenceHandler.IgnoreCycles` mogą pojawić się wyjątki przy serializacji encji z cyklicznymi referencjami (np. `Order → User → Orders`).

**Fix:** Odkomentuj — jest poprawny i bezpieczny.

---

### N-2: Brak lazy loadingu dla tras adminowych

**Plik:** Frontend — plik routingu

**Problem:** Panele admin (duże strony z tabelami, formularzami) są ładowane razem z resztą aplikacji — wolniejszy initial load dla zwykłych użytkowników.

**Fix:**
```tsx
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));

// w routerze:
<Route path="/admin/*" element={
  <Suspense fallback={<Spinner />}>
    <AdminDashboard />
  </Suspense>
} />
```

---

### N-3: Brak rate limitingu na API

**Plik:** `Backend/PlantStore.Api/Program.cs`

**Problem:** Endpoint `/api/auth/login` można atakować brute-force bez limitu prób.

**Fix (.NET 8 ma wbudowany rate limiter):**
```csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
    });
});

app.UseRateLimiter();

// AuthController.cs
[HttpPost("login")]
[EnableRateLimiting("auth")]
public async Task<IActionResult> Login(...) { }
```

---

### N-4: Redundancja modelu adresu użytkownika

**Plik:** `Backend/PlantStore.Api/Models/User.cs`

**Problem:** Model `User` ma jednocześnie pola adresowe inline (`Street`, `HouseNumber`, `PostalCode`, `City`, `Country`) oraz kolekcję `ICollection<UserAddress>` — dwa systemy adresów na raz.

**Fix:** Zdecyduj czy użytkownik ma jeden adres (pola inline, prostsze) czy wiele adresów (relacja `UserAddress`, bardziej elastyczne) i usuń drugi system. Na razie zostawienie inline jest akceptowalne przy checkout.

---

### N-5: Brak testów

**Problem:** Projekt nie ma żadnych testów (unit ani integracyjnych). Refaktor lub bugfix nie ma siatki bezpieczeństwa.

**Rekomendacja (minimum):**
- Backend: projekt `PlantStore.Tests` z xUnit + testami dla `AuthController` (register/login) i `OrdersController` (create order)
- Frontend: Vitest + React Testing Library dla `CartProvider` i `CheckoutPage`

---

## ARCHITEKTURA — Backend

---

### A-B1: Brak warstwy serwisów — logika biznesowa w kontrolerach

**Pliki:** wszystkie kontrolery (`AuthController.cs`, `OrdersController.cs`, `CartController.cs`, `ProductsController.cs`, `AdminOrdersController.cs`)

**Problem:** Kontrolery bezpośrednio korzystają z `AppDbContext` i zawierają logikę biznesową (haszowanie hasła, tworzenie zamówień, walidacja stock, generowanie tokenów JWT). To sprawia, że:
- Kontroler robi zbyt wiele — trudny do czytania i testowania
- Ta sama logika jest kopiowana między kontrolerami (np. create order)
- Każda zmiana biznesowa wymaga edycji kontrolera

**Przykład z `AuthController.cs`:**
```csharp
// Logika biznesowa bezpośrednio w kontrolerze:
if (_context.Users.Any(u => u.Email == dto.Email)) { ... }
user.PasswordHash = _hasher.HashPassword(user, dto.Password);
_context.Users.Add(user);
await _context.SaveChangesAsync();
```

**Fix — stwórz serwisy dla głównych obszarów:**
```csharp
// Services/IAuthService.cs
public interface IAuthService
{
    Task<User> RegisterAsync(UserRegisterDto dto);
    Task<string> LoginAsync(UserLoginDto dto); // zwraca JWT
}

// Services/IOrderService.cs
public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderDto dto, int userId);
    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);
    Task UpdateStatusAsync(int orderId, string status);
}
```
Kontroler staje się cienką warstwą routingu — tylko wywołuje serwis i mapuje odpowiedź.

---

### A-B2: `AppDbContext` używany bezpośrednio we wszystkich kontrolerach

**Pliki:** wszystkie 15 kontrolerów

**Problem:** Każdy kontroler injektuje `AppDbContext` bezpośrednio. Skutki:
- Niemożliwe do przetestowania bez prawdziwej bazy
- Brak enkapsulacji zapytań — te same Include() są kopiowane w wielu miejscach
- Zmiany w strukturze DB wymagają przeszukiwania wszystkich kontrolerów

**Fix — minimum viable:** Wyciągnij powtarzające się zapytania do serwisów lub metod pomocniczych. Nie musisz od razu wdrażać pełnego Repository Pattern — sam serwis mocno poprawia sytuację. Pełne repozytorium ma sens gdy projekt będzie wymagał testów integracyjnych.

---

### A-B3: Brak FluentValidation dla większości DTO

**Pliki:** `Validators/` — tylko `ReviewValidator.cs` istnieje. Pozostałe ~25 DTO nie mają walidatorów.

**Problem:** Walidacja jest ad-hoc w kontrolerach (lub jej nie ma). FluentValidation jest już zainstalowane — wystarczy dodać walidatory.

**Najbardziej potrzebne walidatory do dodania:**
- `UserRegisterDtoValidator` (K-1 już to opisuje)
- `CreateOrderDtoValidator` — sprawdź że `Items` nie jest puste, `Quantity > 0`
- `CartItemCreateDtoValidator` — `Quantity > 0`, `ProductId > 0`
- `ProductCreateDtoValidator` — `Price > 0`, `Name` nie jest pusty

**Fix — schemat dla każdego:**
```csharp
// Validators/CreateOrderDtoValidator.cs
public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("Zamówienie musi zawierać produkty.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Ilość musi być większa od 0.");
            item.RuleFor(i => i.ProductId).GreaterThan(0);
        });
    }
}
```
Zarejestruj wszystko jedną linią:
```csharp
// ServicesConfiguration.cs — już jest AddFluentValidation, upewnij się że skanuje assembly
builder.Services.AddValidatorsFromAssemblyContaining<ReviewValidator>();
```

---

### A-B4: Hardkodowany adres nadawcy w `FurgonetkaShippingService.cs`

**Plik:** `Backend/PlantStore.Api/Services/FurgonetkaShippingService.cs` (linia ~54-64)

**Problem:** Adres nadawcy (`Siedziba 1, 99-999`) jest wpisany na stałe w kodzie — zmiana adresu firmy = zmiana kodu i deploy.

**Fix:**
```json
// appsettings.json
"Furgonetka": {
  "ApiToken": "",
  "SenderName": "Fructoplant",
  "SenderStreet": "Siedziba 1",
  "SenderPostalCode": "99-999",
  "SenderCity": "Miasto"
}
```
```csharp
// FurgonetkaOptions.cs
public class FurgonetkaOptions
{
    public string ApiToken { get; set; } = "";
    public string SenderName { get; set; } = "";
    public string SenderStreet { get; set; } = "";
    public string SenderPostalCode { get; set; } = "";
    public string SenderCity { get; set; } = "";
}
```

---

### A-B5: `FurgonetkaController` — porównanie statusów przez magic strings

**Plik:** `Backend/PlantStore.Api/Controllers/FurgonetkaController.cs` (linia ~145)

**Problem:**
```csharp
var readyStatuses = new HashSet<string>(StringComparer.OrdinalIgnoreCase) {
    "confirmed", "paid", "opłacone", "potwierdzone"
};
```
Mieszanka angielskich i polskich statusów, bez związku z enum `OrderStatus` — błąd synchronizacji z jednym miejscem da bug nie do znalezienia.

**Fix:** Użyj enum:
```csharp
// Models/OrderStatus.cs (jeśli nie istnieje jako enum)
public enum OrderStatus { Pending, Confirmed, Paid, Shipped, Delivered, Cancelled }

// FurgonetkaController.cs
var readyStatuses = new[] { OrderStatus.Confirmed, OrderStatus.Paid };
var orders = await _context.Orders
    .Where(o => readyStatuses.Contains(o.Status))
    .ToListAsync();
```

---

## ARCHITEKTURA — Frontend

---

### A-F1: Wywołania API bezpośrednio w komponentach zamiast w hookach

**Pliki:**
- `src/pages/product/ProductPage.tsx` — wywołuje `getProductById()` i `getReviews()` w `useEffect`
- `src/components/ProductList/ProductList.tsx` — wywołuje `getProducts()` i `getPromotions()` w `useEffect`
- `src/pages/checkout/CheckoutPage.tsx` — wywołuje `createOrder()` bezpośrednio w handlerze
- `src/admin/pages/AdminProducts.tsx` — wywołuje admin API w `useEffect`

**Problem:** Logika ładowania danych (loading state, error state, retry) jest zduplikowana w każdym komponencie. Komponenty są trudne do testowania i ponownego użycia.

**Fix — wyciągnij do dedykowanych hooków:**
```typescript
// hooks/useProduct.ts
export function useProduct(id: number) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch(err => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

// hooks/useCheckout.ts
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = async (dto: CreateOrderDto) => {
    setLoading(true);
    try {
      return await createOrder(dto);
    } catch (err) {
      setError(getApiErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
}
```

---

### A-F2: Niespójna organizacja warstwy API

**Problem:** API jest podzielone na dwa foldery z różnymi konwencjami:
```
src/api/productsApi.ts          ← plain functions
src/api/cartApi.ts              ← plain functions
src/admin/Api/productApi.ts     ← inne nazewnictwo, inna ścieżka
src/admin/Api/orderApi.ts
```
Część używa `BaseApiService`, część bezpośrednio `axios`. Oba foldery często importują te same typy.

**Fix — ujednolicona struktura:**
```
src/api/
  productApi.ts
  orderApi.ts
  cartApi.ts
  authApi.ts
  reviewApi.ts
  admin/
    adminProductApi.ts
    adminOrderApi.ts
    adminUserApi.ts
```
Wszystkie pliki używają tej samej instancji axios z interceptorami. Nazwy plików: camelCase, suffix `Api`.

---

### A-F3: `AuthContext.tsx` używa natywnego `fetch()` zamiast axios instance

**Plik:** `Frontend/plant-store-frontend/src/context/AuthContext.tsx`

**Problem:** Przy sprawdzaniu zalogowanego użytkownika (`/api/user/me`) jest używany `fetch()` bezpośrednio, z ręcznym dodawaniem headera `Authorization`. To omija interceptory axios (np. przyszły 401 handler).

```tsx
// Obecny kod — pomija interceptory axios
fetch(`${API_BASE}api/user/me`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

**Fix:**
```typescript
// Użyj axios instance — interceptory działają automatycznie
import axiosInstance from '../api/axiosInstance';

const response = await axiosInstance.get('/api/user/me');
```

---

### A-F4: Brak Error Boundary — błąd w komponencie crashuje całą aplikację

**Plik:** `Frontend/plant-store-frontend/src/App.tsx` — brak Error Boundary

**Problem:** Każdy niezłapany błąd JS w komponencie powoduje biały ekran dla użytkownika bez możliwości powrotu.

**Fix:**
```tsx
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Błąd aplikacji:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-xl font-semibold">Coś poszło nie tak.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Spróbuj ponownie
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```
```tsx
// App.tsx
<ErrorBoundary>
  <Router>...</Router>
</ErrorBoundary>
```

---

### A-F5: Koszyk — brak scalania lokalnego koszyka z serwerowym przy logowaniu

**Plik:** `Frontend/plant-store-frontend/src/context/CartProvider.tsx`

**Problem:** Użytkownik dodaje produkty do koszyka jako gość (localStorage). Loguje się — lokalny koszyk jest ignorowany, użytkownik widzi pusty koszyk. Frustrujące UX.

**Fix — scalanie koszyka przy logowaniu:**
```typescript
// W CartProvider — po zalogowaniu użytkownika
const mergeCartsOnLogin = async () => {
  const localItems = getLocalCart(); // z localStorage
  if (localItems.length === 0) return;

  // Dodaj każdy lokalny item do serwera
  await Promise.all(localItems.map(item =>
    apiAddToCart({ productId: item.productId, quantity: item.quantity })
  ));

  clearLocalCart();
  await fetchCart(); // odśwież z serwera
};
```
Wywołaj `mergeCartsOnLogin()` w `login()` w `AuthContext` po pomyślnym zalogowaniu.

---

## Podsumowanie — kolejność działań

| Priorytet | # | Zadanie |
|-----------|---|---------|
| TERAZ | K-1 | Wyrzuć sekrety z `appsettings.json` → env vars |
| TERAZ | K-2 | Wyrzuć dane wrażliwe z `.env` frontendowych |
| TERAZ | K-3 | Podłącz prawdziwy token Furgonetka w serwisie (IOptions) |
| WKRÓTCE | H-6 | Dodaj globalny ExceptionHandlingMiddleware |
| WKRÓTCE | H-1 | Dodaj walidację hasła (FluentValidation) |
| WKRÓTCE | H-2 | CORS z konfiguracji, nie hardkod |
| WKRÓTCE | H-5 | Zdecyduj: dokończ Stripe lub usuń |
| WKRÓTCE | A-B3 | Dodaj brakujące walidatory FluentValidation dla DTO |
| WKRÓTCE | A-F4 | Dodaj ErrorBoundary w App.tsx |
| WKRÓTCE | A-F3 | Zastąp `fetch()` w AuthContext przez axios instance |
| NASTĘPNIE | H-3 | AsNoTracking() + sprawdź Include w queries |
| NASTĘPNIE | H-4 | Paginacja w adminOrdersController |
| NASTĘPNIE | S-2 | Ujednolicenie autoryzacji ([Authorize(Roles)]) |
| NASTĘPNIE | S-3 | Zaimplementuj errorHandling.ts |
| NASTĘPNIE | S-7 | 401 interceptor w Axios |
| NASTĘPNIE | A-B5 | OrderStatus jako enum — usuń magic strings statusów |
| NASTĘPNIE | A-B4 | Adres nadawcy Furgonetka z konfiguracji |
| NASTĘPNIE | A-F1 | Wyciągnij API calls z komponentów do hooków |
| NASTĘPNIE | A-F5 | Scalanie lokalnego koszyka przy logowaniu |
| NASTĘPNIE | S-1 | Wyciągnij logikę generowania etykiety do serwisu |
| NASTĘPNIE | S-5 | Stałe Roles.Admin / Claims.IsAdmin zamiast magic strings |
| NASTĘPNIE | S-6 | Walidacja pustego koszyka w CheckoutPage + backend |
| KIEDY CZAS | A-B1 | Warstwa serwisów — wyciągnij logikę biznesową z kontrolerów |
| KIEDY CZAS | A-F2 | Ujednolicenie struktury folderów API (/api + /admin/Api) |
| KIEDY CZAS | N-1 | Odkomentuj JSON serialization config |
| KIEDY CZAS | N-3 | Rate limiting na /auth/login |
| KIEDY CZAS | N-2 | Lazy loading tras admin |
| KIEDY CZAS | N-5 | Testy (xUnit + Vitest) |
