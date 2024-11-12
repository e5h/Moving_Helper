using Moving_Helper_Server.SharedLibrary.Features.LocationFeature;

namespace Moving_Helper_Server.API.Features.LocationFeature;

public static class LocationEndpoints
{
    public const string LOCATION_ENDPOINT_HANDLE = "/api/v1/locations";
    public const string LOCATION_GET_ALL_INFO    = "GetAllLocationInfo";
    public const string LOCATION_GET_ALL_DETAILS = "GetAllLocationDetails";
    public const string LOCATION_GET_INFO        = "GetLocationInfo";
    public const string LOCATION_GET_DETAILS     = "GetLocationDetails";
    public const string LOCATION_SEARCH_DETAILS  = "SearchLocationDetails";
    public const string LOCATION_GET_BOX_IDS     = "GetLocationBoxIds";
    public const string LOCATION_GET_ITEM_IDS    = "GetLocationItemIds";
    public const string LOCATION_CREATE          = "CreateLocation";
    public const string LOCATION_DELETE          = "DeleteLocation";

    public static RouteGroupBuilder MapLocationEndpoints(this WebApplication app)
    {
        var routeGroup = app.MapGroup(LOCATION_ENDPOINT_HANDLE);

        routeGroup.MapGet("/info", async (ILocationService locationService) =>
        {
            var allLocationInfo = await locationService.GetAllLocationInfoAsync();
            
            return Results.Ok(allLocationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_ALL_INFO);
        
        routeGroup.MapGet("/details", async (ILocationService locationService) =>
        {
            var allLocationDetails = await locationService.GetAllLocationDetailsAsync();
            
            return Results.Ok(allLocationDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_ALL_DETAILS);
        
        routeGroup.MapGet("/info/{id}", async (ILocationService locationService, int id) =>
        {
            var locationInfo = await locationService.GetLocationInfoAsync(id);

            if (locationInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_INFO);
        
        routeGroup.MapGet("/details/{id}", async (ILocationService locationService, int id) =>
        {
            var locationDetails = await locationService.GetLocationDetailsAsync(id);

            if (locationDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(locationDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_DETAILS);
        
        routeGroup.MapGet("/search", async (ILocationService locationService, string searchTerm) =>
        {
            var matchingLocationDetails = await locationService.GetLocationDetailsMatchingStringAsync(searchTerm);

            if (matchingLocationDetails == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(matchingLocationDetails);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_SEARCH_DETAILS);
        
        routeGroup.MapGet("/boxids/{id}", async (ILocationService locationService, int id) =>
        {
            var allBoxIds = await locationService.GetLocationAllBoxIdsAsync(id);

            if (allBoxIds == null || allBoxIds.Count == 0)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(allBoxIds);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_BOX_IDS);
        
        routeGroup.MapGet("/itemids/{id}", async (ILocationService locationService, int id) =>
        {
            var allItemIds = await locationService.GetLocationAllItemIdsAsync(id);

            if (allItemIds == null || allItemIds.Count == 0)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(allItemIds);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_GET_ITEM_IDS);

        routeGroup.MapPost("/create", async (ILocationService locationService, LocationCreateDto createDto) =>
        {
            var locationInfo = await locationService.CreateLocationAsync(createDto);
            
            return Results.CreatedAtRoute(LOCATION_GET_INFO, new { id = locationInfo.Id }, locationInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_CREATE);
        
        routeGroup.MapDelete("/delete/{id}", async (ILocationService locationService, int id) =>
        {
            var locationDeleted = await locationService.DeleteLocationAsync(id);
            
            return locationDeleted ? Results.NoContent() : Results.NotFound();
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(LOCATION_DELETE);

        return routeGroup;
    }
}