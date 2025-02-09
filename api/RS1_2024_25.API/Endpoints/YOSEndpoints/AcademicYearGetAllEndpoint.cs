using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;

namespace RS1_2024_25.API.Endpoints.YOSEndpoints
{
    [Route("yos")]
    [MyAuthorization(isAdmin: true, isManager: false)]
    public class AcademicYearGetAllEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync.WithoutRequest.WithActionResult<List<AcademicYearGetResponse>>
    {
        [HttpGet("academic-years")]
        public override async Task<ActionResult<List<AcademicYearGetResponse>>> HandleAsync(CancellationToken cancellationToken = default)
        {
            return Ok(await db.AcademicYears.Select(ay => new AcademicYearGetResponse
            {
                Id = ay.ID,
                Name = ay.Description
            }).ToListAsync(cancellationToken));
        }
    }

    public class AcademicYearGetResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
