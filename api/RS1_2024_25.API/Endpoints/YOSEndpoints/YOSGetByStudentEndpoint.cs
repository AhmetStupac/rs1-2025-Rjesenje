using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.YOSEndpoints
{
    [Route("yos")]
    [MyAuthorization(isAdmin: true, isManager: false)]
    public class YOSGetByStudentEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithRequest<int>.WithActionResult<List<YOSGetResponse>>
    {
        [HttpGet("get/{id}")]
        public override async Task<ActionResult<List<YOSGetResponse>>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            await db.AcademicYears.LoadAsync(cancellationToken);
            await db.MyAppUsers.LoadAsync(cancellationToken);

            return Ok(await db.YearsOfStudy.Where(yos => yos.StudentId == id).Select(yos => new YOSGetResponse
            {
                Id = yos.Id,
                Obnova = yos.Obnova,
                DatumUpisa = DateOnly.FromDateTime(yos.DatumUpisa),
                GodinaStudija = yos.GodinaStudija,
                Snimio = yos.Snimio != null ? yos.Snimio.Email : "",
                AkademskaGodina = yos.AkademskaGodina != null ? yos.AkademskaGodina.Description : "",
                AkademskaGodinaId = yos.AkademskaGodinaId,
                StudentId = yos.StudentId,
            }).ToListAsync(cancellationToken));
        }
    }

    public class YOSGetResponse
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int AkademskaGodinaId { get; set; }
        public string AkademskaGodina { get; set; } = string.Empty;
        public int GodinaStudija { get; set; }
        public bool Obnova { get; set; }
        public DateOnly DatumUpisa { get; set; }
        public string Snimio { get; set; } = string.Empty;
    }
}
