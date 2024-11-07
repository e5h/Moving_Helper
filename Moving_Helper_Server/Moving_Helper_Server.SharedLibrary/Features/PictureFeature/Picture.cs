using System.ComponentModel.DataAnnotations;

namespace Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

public class Picture
{
    public                  int    Id          { get; set; }
    [MaxLength(255)] public string Description { get; set; }
    [MaxLength(255)] public string URI         { get; set; } // URI to image location
    public                  byte[] DataB64     { get; set; } // Base64 encoded data
}