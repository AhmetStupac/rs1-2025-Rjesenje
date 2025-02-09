using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.YOSEndpoints
{
    [Route("yos")]
    [MyAuthorization(isAdmin: true, isManager: false)]
    public class YOSCreateEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<YOSCreateRequest>.WithActionResult<int>
    {
        [HttpPost("create")]
        public override async Task<ActionResult<int>> HandleAsync(YOSCreateRequest request, CancellationToken cancellationToken = default)
        {
            YearOfStudy yos = new YearOfStudy
            {
                DatumUpisa = request.DatumUpisa,
                AkademskaGodinaId = request.AkademskaGodinaId,
                SnimioId = request.SnimioId,
                StudentId = request.StudentId,
                GodinaStudija = request.GodinaStudija,
            };

            bool isRenewing = await db.YearsOfStudy.Where(yos => yos.GodinaStudija == request.GodinaStudija && yos.StudentId == request.StudentId)
                .FirstOrDefaultAsync(cancellationToken) != null;

            yos.CijenaSkolarine = isRenewing ? 400f : 1800f;
            yos.Obnova = isRenewing;

            await db.YearsOfStudy.AddAsync(yos, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);

            return Ok(yos.Id);
        }
    }

    public class YOSCreateRequest
    {
        public int StudentId { get; set; }
        public int AkademskaGodinaId { get; set; }
        public int GodinaStudija { get; set; }
        public int SnimioId { get; set; }
        public DateTime DatumUpisa { get; set; }
    }
}
