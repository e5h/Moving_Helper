using Moving_Helper_Server.SharedLibrary.Features.PictureFeature;

namespace Moving_Helper_Server.API.Features.PictureFeature;

public static class PictureEndpoints
{
    public const string PICTURE_ENDPOINT_HANDLE = "/api/v1/picture";
    public const string PICTURE_GET_ALL_INFO    = "GetAllPictureInfo";
    public const string PICTURE_GET_INFO        = "GetPictureInfo";
    public const string PICTURE_CREATE          = "CreatePicture";
    public const string PICTURE_DELETE          = "DeletePicture";
    public const string PICTURE_DOWNLOAD        = "DownloadPicture";
    public const string PICTURE_UPLOAD          = "UploadPicture";

    public static RouteGroupBuilder MapPictureEndpoints(this WebApplication app)
    {
        var routeGroup = app.MapGroup(PICTURE_ENDPOINT_HANDLE);
        
        // GET - get information DTOs for all saved pictures.
        routeGroup.MapGet("/info", async (IPictureService pictureService) =>
        {
            var allPictureInfo = await pictureService.GetAllPictureInfoAsync();
        
            return Results.Ok(allPictureInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_GET_ALL_INFO);
        
        // GET - get an information DTO for the specified picture.
        routeGroup.MapGet("/info/{id}", async (IPictureService pictureService, int id) =>
        {
            var pictureInfo = await pictureService.GetPictureInfoAsync(id);

            if (pictureInfo == null)
            {
                return Results.NotFound();
            }
            
            return Results.Ok(pictureInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_GET_INFO);

        // POST - create a new picture (this does not actually create a file).
        routeGroup.MapPost("/create", async (IPictureService pictureService, PictureCreateDto createDto) =>
        {
            var pictureInfo = await pictureService.CreatePictureAsync(createDto);
            
            return Results.CreatedAtRoute(PICTURE_GET_INFO, new { id = pictureInfo.Id }, pictureInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_CREATE);

        // DELETE - deletes a picture from the database, but does not delete from the filesystem.
        routeGroup.MapDelete("/delete/{id}", async (IPictureService pictureService, int id) =>
        {
            var pictureDeleted = await pictureService.DeletePictureAsync(id);

            return pictureDeleted ? Results.NoContent() : Results.NotFound();
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_DELETE);

        // GET - "downloads" a picture.
        routeGroup.MapGet("/download/{id}", async (IPictureService pictureService, int id) =>
        {
            var pictureData = await pictureService.DownloadPictureAsync(id);

            if (pictureData == null)
            {
                return Results.NotFound();
            }
            
            return Results.File(pictureData.Data, "image/jpeg");
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_DOWNLOAD);

        // POST - "uploads" a picture.
        routeGroup.MapPost("/upload", async (IPictureService pictureService, HttpRequest request) =>
        {
            if (!request.HasFormContentType || request.Form.Files.Count == 0)
            {
                return Results.BadRequest("No image file uploaded.");
            }
            
            var formFile    = request.Form.Files[0];
            var fileName    = request.Form["Filename"].ToString();
            var description = request.Form["Description"].ToString();
            
            if (string.IsNullOrEmpty(fileName) || string.IsNullOrEmpty(description))
            {
                return Results.BadRequest("Filename and Description are required.");
            }
            
            var    createDto = new PictureCreateDto(fileName, description);
            byte[] pictureData;
            
            using (var stream = new MemoryStream())
            {
                await formFile.CopyToAsync(stream);
                pictureData = stream.ToArray();
            }

            var uploadDto = new PictureUploadDto(createDto, pictureData);
            
            var pictureInfo = await pictureService.UploadPictureAsync(uploadDto);

            if (pictureInfo == null)
            {
                return Results.BadRequest("Could not upload the file.");
            }

            return Results.Ok(pictureInfo);
        })
        .WithParameterValidation()
        .WithOpenApi()
        .WithName(PICTURE_UPLOAD);

        return routeGroup;
    }
}