using System.ComponentModel.DataAnnotations;
using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;
using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

namespace Moving_Helper_Server.SharedLibrary.Features.BoxFeature;

/// <summary>
/// This models a box, which holds items. A box must have a current location, but the
/// source and destination are optional. These can always be set later.
/// </summary>
public class Box
{
    public                                      int       Id          { get; set; }
    [Required] [MaxLength(20)]  public required string    Label       { get; set; }
    [Required] [MaxLength(512)] public required string    Description { get; set; }
    [Required]                  public          Location  Location    { get; set; }
    public                                      int       LocationId  { get; set; }
    public                                      Location? MoveFrom    { get; set; }
    public                                      int       MoveFromId  { get; set; }
    public                                      Location? MoveTo      { get; set; }
    public                                      int       MoveToId    { get; set; }
    public                                      Picture?  Picture     { get; set; }
    public                                      int       PictureId   { get; set; }
}