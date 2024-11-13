using Microsoft.EntityFrameworkCore;

namespace Moving_Helper_Server.API.Database;

public static class DatabaseExtensions
{
    /// <summary>
    /// This is an extension method, which means it can be called using any <see cref="WebApplication"/> object
    /// as if the object defined the method. This is simply used as a wrapper to set up the database each time
    /// the program is run, instead of needing to manually migrate the database using the "dotnet ef" command line
    /// tools. Similar to the "i++" method being equivalent to "i = i + 1".
    /// </summary>
    /// <param name="app">The <see cref="WebApplication"/>, called using "WebApplication.ThisMethod()".</param>
    public static async Task MigrateDatabaseAsync(this WebApplication app)
    {
        // Need a scope to request any of the services which are a part of the application.
        using var scope     = app.Services.CreateScope();
        var       dbContext = scope.ServiceProvider.GetRequiredService<MovingHelperDbContext>();

        await dbContext.Database.MigrateAsync();
    }
}