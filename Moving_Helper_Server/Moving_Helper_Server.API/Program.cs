using Moving_Helper_Server.API.Database;
using Moving_Helper_Server.API.Features.ItemFeature;
using Moving_Helper_Server.API.Features.BoxFeature;
using Moving_Helper_Server.API.Features.LocationFeature;
using Moving_Helper_Server.API.Features.PictureFeature;

var builder = WebApplication.CreateBuilder(args);

// Retrieve the connection string from appsettings.json and use this to connect to a 
// SQLite database storing the application data.
var dbConnString = builder.Configuration.GetConnectionString("MovingHelperDb");
builder.Services.AddSqlite<MovingHelperDbContext>(dbConnString);

// Add all feature services
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IBoxService, BoxService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IPictureService, PictureService>();

// Add API utilities to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// TODO: Set up a logger (Serilog?)

var frontendHostString = builder.Configuration.GetConnectionString("MovingHelperFrontend");

if (frontendHostString != null)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowViteServer", policy =>
        {
            policy.WithOrigins(frontendHostString)
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
    });
    Console.WriteLine("Configured CORS for frontend host: " + frontendHostString);
}
else
{
    Console.WriteLine("Moving helper frontend address has not been configured! CORS is unavailable.");
    Console.WriteLine("Add the 'MovingHelperFrontend' address to 'appsettings.json'.");
}

// Build the application
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // If this is in development, use the nice API exploration tools.
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // If this is production, use a default path when an error is encountered instead of dumping the stack
    // trace. Also, enforce using HTTP strict transport security - default value is 30 days.
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Redirect HTTP requests to HTTPS when possible.
app.UseHttpsRedirection();

app.UseCors("AllowViteServer");

// Migrate the database, prevents the need for manual dotnet command line operations.
await app.MigrateDatabaseAsync();

app.MapLocationEndpoints();
app.MapBoxEndpoints();
app.MapItemEndpoints();
app.MapPictureEndpoints();

app.Run();