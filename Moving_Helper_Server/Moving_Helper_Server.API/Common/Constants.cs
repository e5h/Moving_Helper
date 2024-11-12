namespace Moving_Helper_Server.API.Common;

public static class Constants
{
    public const string PICTURES_RELATIVE_PATH = "/data/pictures";

    public static string PicturesPath()
    {
        return Path.Combine(AppContext.BaseDirectory, PICTURES_RELATIVE_PATH);
    }
}