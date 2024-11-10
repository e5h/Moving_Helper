using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public record PictureCreateDto(
    [Required] [MaxLength(255)] string Path,
    [Required] [MaxLength(255)] string Description
);

public record PictureInfoDto(
    [Required] int Id,
    [Required] string Path,
    [Required] string Description
);

public record PictureDetailsDto(
    [Required] int Id,
    [Required] string Path,
    [Required] string Description
);