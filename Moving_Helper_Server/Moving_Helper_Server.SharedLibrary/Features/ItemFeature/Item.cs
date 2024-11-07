using System.ComponentModel.DataAnnotations;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;
using Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

namespace Moving_Helper_Server.SharedLibrary.Features.ItemFeature;

/// <summary>
/// This models a generic movable item. A name is required, but the description, picture,
/// and box are all optional if there is a standalone item.
/// </summary>
public class Item
{
    public                                     int      Id          { get; set; }
    [Required] [MaxLength(50)] public required string   Name        { get; set; }
    [MaxLength(512)]                    public string   Description { get; set; }
    public                                     Picture? Picture     { get; set; }
    public                                     int      PictureId   { get; set; }
    public                                     Box?     Box         { get; set; }
    public                                     int      BoxId       { get; set; }
}