namespace Moving_Helper_Server.API.Common;

public static class Constants
{
    public static string PicturesPath()
    {
        var picturesPath = Path.Combine("data", "pictures");
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, picturesPath);
    }
}