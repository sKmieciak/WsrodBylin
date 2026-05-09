using FluentValidation;
using PlantStore.Api.Dtos;

namespace PlantStore.Api.Validators
{
    public class CartItemCreateDtoValidator : AbstractValidator<CartItemCreateDto>
    {
        public CartItemCreateDtoValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0).WithMessage("Nieprawidłowy produkt.");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Ilość musi być większa od 0.");
        }
    }
}
