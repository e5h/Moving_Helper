# Moving Helper App

## Purpose

This is a web app which is designed to make moving easier by cataloging items. It provides an interface to view the contents of boxes, search for specific items, and determine where each box is located.

Any type of label or identifier can be used for the boxes. I used hex codes with sheets of [3 1/3" x 4" pre-cut adhesive paper labels](https://www.amazon.ca/dp/B0B8ZDN7FG). There is a .xlsx spreadsheet which makes printing these labels easier - they worked in my inexpensive inkjet printer.

## How To Use

### Packing

1. Attach unique labels / identifiers to boxes
2. On the web app, select / create the box you are putting items into
3. Take a picture of the box
4. For each physical item going into the box, press the "add item" button:
  - Provide a name for the item
  - Add any useful information in the description box
  - Provide tags if desired
5. (Optional) choose where the box is currently located
6. (Optional) choose where the box will be moved to

### Moving (TBD)

1. View the web interface for showing boxes grouped by destination and source
2. Coordinate "trips" with selections of boxes
3. Use checkboxes to confirm when items have been moved

### Unpacking

Unpacking can involve a few different processes:

- Search for a specific item to determine which box contains it, and where the box is located
- Select a box to determine what it contains
- See a record of which boxes have been moved, and where they have been moved to

## Design

### High Level

![High Level Design](/Design%20Docs/design-diagrams-high-level.png "High Level Design")

### Models

![Models](/Design%20Docs/design-diagrams-models.png "Models")

### Database

![Database](/Design%20Docs/design-diagrams-database.png "Database")

### API Endpoints

![API Endpoints](/Design%20Docs/design-diagrams-api-endpoints.png "API Endpoints")