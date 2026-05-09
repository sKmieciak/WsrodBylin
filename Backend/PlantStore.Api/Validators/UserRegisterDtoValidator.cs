using FluentValidation;
using PlantStore.Api.Dtos;

namespace PlantStore.Api.Validators
{
    public class UserRegisterDtoValidator : AbstractValidator<UserRegisterDto>
    {
        public UserRegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("E-mail jest wymagany.")
                .EmailAddress().WithMessage("Niepoprawny adres e-mail.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Hasło jest wymagane.")
                .MinimumLength(8).WithMessage("Hasło musi mieć minimum 8 znaków.");

            RuleFor(x => x.FirstName).NotEmpty().WithMessage("Imię jest wymagane.");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Nazwisko jest wymagane.");
        }
    }
}
