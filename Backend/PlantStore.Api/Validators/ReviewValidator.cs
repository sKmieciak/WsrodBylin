using FluentValidation;
using PlantStore.Api.DTOs;

namespace PlantStore.Api.Validators
{
    public class ReviewDtoValidator : AbstractValidator<ReviewDto>
    {
        public ReviewDtoValidator()
        {
            RuleFor(x => x.AuthorName)
                .NotEmpty().WithMessage("Imię autora jest wymagane.")
                .MaximumLength(100);

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Treść opinii nie może być pusta.")
                .MaximumLength(1000);

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Ocena musi być w zakresie 1–5.");
        }
    }
}
