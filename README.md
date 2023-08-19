# fathym-forecast-maptiles
A Generic Forecast Maptiles Display for Fathym

Built with Fathym, Vite, Tailwind, React

Fathym Forecast available tile types:

    CloudCover_EntireAtmosphere   [max zoom: 3] [max zoom 6: US only]
    Precipitation_Surface         [max zoom: 3] [max zoom 6: US only]
    Temperature_2Meters           [max zoom: 3] [max zoom 6: US only]
    Visibility_Surface            [max zoom: 3] [max zoom 6: US only]
    Wind_10Meters                 [max zoom: infinite]

World Temperature_2Meters at Zoom 2 with an Opacity of 50%:

Map Scales:

    XSmall Map     zoom = 0   xTiles = 1    yTiles = 1    mapWidth = 256
    Small Map      zoom = 1   xTiles = 2    yTiles = 2    mapWidth = 512
    Medium Map     zoom = 2   xTiles = 4    yTiles = 3    mapWidth = 1024
    Large Map      zoom = 3   xTiles = 8    yTiles = 6    mapWidth = 2048
    XLarge Map     zoom = 4   xTiles = 16   yTiles = 12   mapWidth = 4096
    XXLarge Map    zoom = 5   xTiles = 32   yTiles = 24   mapWidth = 8192
    XXXLarge Map   zoom = 6   xTiles = 64   yTiles = 48   mapWidth = 16384

    Map tiles are 256x256

Because The US only zoom only renders the tiles for the CONUS, these maps' mapWidth are smaller:
    
    CONUS zoom 4: mapWidth = 1024
    CONUS zoom 5: mapWidth = 2048
    CONUS zoom 6: mapWidth = 4096

The available map tiles returns the type of map:
    
      CloudCover_EntireAtmosphere,
      Precipitation_Surface,
      Temperature_2Meters,
      Visibility_Surface,
      Wind_10Meters
      
...at the time(s) the maps are available:
    
      The Nearest Half Hour to the Current Time
      and a Map every half hour for the next 12 hours
      (with some variation).

Using the lcuState.js as a config:

  API Routes for Dev to Production:

    MapTilesAvailable: '/api/v0/maptile-manifest',
    MaptileAPIQuery: '/api/v0/maptile-fetch',
    HabistackAPIRoot: '/api/habistack',

  The Preferences the Map will load with:
  
    DefaultMaptilesPrefs: 
        {
            Zoom: 2,
            XTiles: 4,
            YTiles: 3,
            MapTileType: "Temperature_2Meters",
            UsDetailedMap: false, /* Only works on zoom 4 and above. Doesn't work on Wind_10Meters */
            MapsConfig: [],
            MapSetWidth: 1024, /* Formula: 8*xTiles Except: when usDetailed = true (zoom 6 is 4096) */
            OverlayOpacity: 0.5,
        }
    };

The component makes two calls:
  First, to 'maptile-manifest' to determine what maptimes are available currently and their timestamps.
  Then to 'maptile-fetch' to get the map tile images.

It then arranges them in a grid over a svg of either the CONUS or the whole world depending on the prefs set.

Fathym Forecast Docs: https://www.fathym.com/forecast/docs/
    
