const lcuState = window.LCU?.State || {};

const lcuStateDefaults = {
    MapTilesAvailable: '/api/v0/maptile-manifest',
    MaptileAPIQuery: '/api/v0/maptile-fetch',
    HabistackAPIRoot: '/api/habistack',
    DefaultMaptilesPrefs: 
        {
            Zoom: 2,
            XTiles: 4,
            YTiles: 3,
            MapTileType: "Temperature_2Meters",
            UsDetailedMap: false, /* Only works on zoom 4 and above. Doesn't work on Wind_10Meters */
            MapsConfig: [],
            MapSetWidth: 1024, /* Formula: 8*xTiles Except: when usDetailed = true (zoom 6 is 4096) */
            OverlayOpacity: 0.65,
        }
};

// const LCUState = lcuState || lcuStateDefaults;
let LCUState = lcuStateDefaults;

LCUState = {
    ...lcuStateDefaults,
    ...(lcuState || {})
};

export default LCUState;