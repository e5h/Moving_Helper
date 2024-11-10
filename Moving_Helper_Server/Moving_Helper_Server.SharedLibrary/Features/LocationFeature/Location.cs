using System.ComponentModel.DataAnnotations;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

namespace Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

/// <summary>
/// This models a location where boxes and items can be stored. This is not
/// specific to any sort of structure.
/// </summary>
public class Location
{
    public                                      int      Id          { get; set; }
    [Required] [MaxLength(50)]  public required string   Name        { get; set; }
    [Required] [MaxLength(512)] public          string   Description { get; set; }
    public                                      Picture? Picture     { get; set; }
    public                                      int      PictureId   { get; set; }
}