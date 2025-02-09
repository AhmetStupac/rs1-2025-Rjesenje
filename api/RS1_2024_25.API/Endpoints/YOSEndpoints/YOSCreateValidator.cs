using FluentValidation;
using RS1_2024_25.API.Data;

namespace RS1_2024_25.API.Endpoints.YOSEndpoints
{
    public class YOSCreateValidator : AbstractValidator<YOSCreateRequest>
    {
        public YOSCreateValidator(ApplicationDbContext db)
        {
            RuleFor(x => x.GodinaStudija).NotEmpty().GreaterThanOrEqualTo(50).LessThanOrEqualTo(2000).WithMessage("Godina studija mora biti u rang 50-2000");

            RuleFor(x => x.AkademskaGodinaId).NotEmpty().GreaterThan(0).Must(y => db.AcademicYears.Where(ay => ay.ID == y).FirstOrDefault() != null)
                .WithMessage("Akademska godina id neispravan");

            RuleFor(x => x.SnimioId).NotEmpty().GreaterThan(0).Must(y => db.MyAppUsers.Where(ay => ay.ID == y).FirstOrDefault() != null)
                .WithMessage("Korisnik id neispravan");

            RuleFor(x => x.StudentId).NotEmpty().GreaterThan(0).Must(y => db.StudentsAll.Where(ay => ay.ID == y).FirstOrDefault() != null)
                .WithMessage("Student id neispravan");
        }
    }
}
