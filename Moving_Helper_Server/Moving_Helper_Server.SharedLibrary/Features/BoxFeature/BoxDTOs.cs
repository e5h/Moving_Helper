using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

public class BoxDTOs
{
    public record BoxCreateDto(
        [Required] [MaxLength(20)]  string Label,
        [Required] [MaxLength(512)] string Description,
        [Required]                  int    LocationId
    );

    public record BoxInfoDto(
        [Required] int    Id,
        [Required] string Label,
        [Required] int    LocationId,
        [Required] int    MoveFromId,
        [Required] int    MoveToId,
        [Required] int    PictureId
    );

    public record BoxDetailsDto(
        [Required] int    Id,
        [Required] string Label,
        [Required] string Description,
        [Required] int[]  ItemIds,
        [Required] int    LocationId,
        [Required] string LocationName,
        [Required] int    MoveFromId,
        [Required] string MoveFromName,
        [Required] int    MoveToId,
        [Required] string MoveToName,
        [Required] int    PictureId
    );
}