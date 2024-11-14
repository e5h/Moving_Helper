using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

public record BoxCreateDto(
    [Required]
    [MaxLength(20)]
    string Label,
    
    [Required]
    [MaxLength(512)]
    string Description,
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid location ID provided.")]
    int LocationId,
    
    [Range(1, int.MaxValue, ErrorMessage = "Invalid move from ID provided.")]
    int? MoveFromId,
    
    [Range(1, int.MaxValue, ErrorMessage = "Invalid move to ID provided.")]
    int? MoveToId,
    
    [Range(1, int.MaxValue, ErrorMessage = "Invalid picture ID provided.")]
    int? PictureId
);

public record BoxInfoDto(
    [Required] int    Id,
    [Required] string Label,
    [Required] string Description,
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

public record BoxMoveDto(
    [Required] int BoxId,
    [Required] int NewLocationId
);