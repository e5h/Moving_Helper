using System.ComponentModel.DataAnnotations;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;
using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

namespace Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

/// <summary>
/// This models a generic movable item. The name and box are required.
/// </summary>
public class Item
{
    public                                      int      Id          { get; set; }
    [Required] [MaxLength(50)]  public required string   Name        { get; set; }
    [Required] [MaxLength(512)] public required string   Description { get; set; }
    [Required]                  public          Box      Box         { get; set; }
    public                                      int      BoxId       { get; set; }
    public                                      Picture? Picture     { get; set; }
    public                                      int      PictureId   { get; set; }
}