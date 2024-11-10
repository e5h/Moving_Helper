using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public class Picture
{
    public                                      int    Id          { get; set; }
    [Required] [MaxLength(255)] public required string Path        { get; set; } // Path to image location
    [Required] [MaxLength(255)] public required string Description { get; set; }
}