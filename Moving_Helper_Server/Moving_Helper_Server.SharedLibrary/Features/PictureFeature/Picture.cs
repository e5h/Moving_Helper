﻿using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public class Picture
{
    public                                      int    Id          { get; set; }
    [Required] [MaxLength(255)] public required string FileName    { get; set; }
    [Required] [MaxLength(255)] public required string Description { get; set; }
}