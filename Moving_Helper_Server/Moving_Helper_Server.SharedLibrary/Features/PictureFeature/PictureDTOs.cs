using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public record PictureCreateDto(
    [Required] [MaxLength(255)] string FileName,
    [Required] [MaxLength(255)] string Description
);

public record PictureInfoDto(
    [Required] int Id,
    [Required] string FileName,
    [Required] string Description
);

public record PictureDetailsDto(
    [Required] int Id,
    [Required] string FileName,
    [Required] string Description
);

public record PictureDownloadDto(
    [Required] PictureInfoDto InfoDto,
    [Required] byte[] Data
);

public record PictureUploadDto(
    [Required] PictureCreateDto CreateDto,
    [Required] byte[] Data
);