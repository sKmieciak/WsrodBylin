using FluentValidation;
using PlantStore.Api.Dtos;

namespace PlantStore.Api.Validators
{
    public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderDtoValidator()
        {
            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Zamówienie musi zawierać produkty.");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductId).GreaterThan(0).WithMessage("Nieprawidłowy produkt.");
                item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Ilość musi być większa od 0.");
            });
        }
    }
}
