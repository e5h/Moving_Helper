﻿using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

public record ItemCreateDto(
    [Required] [MaxLength(50)] string Name,
    [Required] [MaxLength(512)] string Description,
    [Required] int BoxId,
    [Required] int PictureId
);

public record ItemInfoDto(
    [Required] int Id,
    [Required] string Name,
    [Required] string Description,
    [Required] int BoxId,
    [Required] int PictureId
);

public record ItemDetailsDto(
    [Required] int Id,
    [Required] string Name,
    [Required] string Description,
    [Required] int BoxId,
    [Required] string BoxLabel,
    [Required] int LocationId,
    [Required] string LocationName,
    [Required] int MoveFromId,
    [Required] string MoveFromName,
    [Required] int MoveToId,
    [Required] string MoveToName,
    [Required] int PictureId
);