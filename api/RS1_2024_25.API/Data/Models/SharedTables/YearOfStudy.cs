using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models.SharedTables
{
    public class YearOfStudy
    {
        [Key]
        public int Id { get; set; }
        public DateTime DatumUpisa { get; set; }
        public int GodinaStudija { get; set; }
        public float CijenaSkolarine { get; set; }
        public bool Obnova { get; set; }
        public int StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student? Student { get; set; }
        public int SnimioId { get; set; }

        [ForeignKey(nameof(SnimioId))]
        public MyAppUser? Snimio { get; set; }
        public int AkademskaGodinaId { get; set; }

        [ForeignKey(nameof(AkademskaGodinaId))]
        public AcademicYear? AkademskaGodina { get; set; }
    }
}
