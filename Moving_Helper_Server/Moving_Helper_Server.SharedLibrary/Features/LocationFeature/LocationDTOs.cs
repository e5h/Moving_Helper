﻿using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

public record LocationCreateDto(
    [Required]
    [MaxLength(50)]
    string Name,
    
    [Required]
    [MaxLength(512)]
    string Description,
    
    [Range(1, int.MaxValue, ErrorMessage = "Invalid picture ID provided.")]
    int? PictureId
);

public record LocationInfoDto(
    [Required] int    Id,
    [Required] string Name,
    [Required] string Description,
    [Required] int    PictureId
);

public record LocationDetailsDto(
    [Required] int    Id,
    [Required] string Name,
    [Required] string Description,
    [Required] int    NumBoxes,
    [Required] int[]  BoxIds,
    [Required] int    PictureId
);