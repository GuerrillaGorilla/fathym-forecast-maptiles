import React, { Component } from "react";
import LCUState from "./lcuState";
import usaoutlines from '../public/usaoutlines.svg';
import worldoutlines from '../public/worldoutlines.svg';

/*  Fathym Forecast Maptiles LCU

    CloudCover_EntireAtmosphere   [max zoom: 3] [max zoom 6: US only]
    Precipitation_Surface         [max zoom: 3] [max zoom 6: US only]
    Temperature_2Meters           [max zoom: 3] [max zoom 6: US only]
    Visibility_Surface            [max zoom: 3] [max zoom 6: US only]
    Wind_10Meters                 [max zoom: infinite]

    XSmall Map     zoom = 0   xTiles = 1    yTiles = 1    mapWidth = 256
    Small Map      zoom = 1   xTiles = 2    yTiles = 2    mapWidth = 512
    Medium Map     zoom = 2   xTiles = 4    yTiles = 3    mapWidth = 1024
    Large Map      zoom = 3   xTiles = 8    yTiles = 6    mapWidth = 2048
    XLarge Map     zoom = 4   xTiles = 16   yTiles = 12   mapWidth = 4096
    XXLarge Map    zoom = 5   xTiles = 32   yTiles = 24   mapWidth = 8192
    XXXLarge Map   zoom = 6   xTiles = 64   yTiles = 48   mapWidth = 16384

    Map tiles are 256x256

    Continuous United States (use the same zoom, xTiles, & yTiles - change mapWidth
      since only tiles over the CONUS are available)

    CONUS zoom 4: mapWidth = 1024
    CONUS zoom 5: mapWidth = 2048
    CONUS zoom 6: mapWidth = 4096

*/

export class WeatherMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maptilesAvailable: LCUState.MapTilesAvailable,
      maptilesSvcQuery: LCUState.MaptileAPIQuery,
      habistackSvcUrl: LCUState.HabistackAPIRoot,
      imageObject: [],
      imagesAvailable: [],
      zoom: LCUState.DefaultMaptilesPrefs.Zoom,
      xTiles: LCUState.DefaultMaptilesPrefs.XTiles,
      yTiles: LCUState.DefaultMaptilesPrefs.YTiles,
      currentTime: "",
      mapTileType: LCUState.DefaultMaptilesPrefs.MapTileType,
      usDetailedMap: LCUState.DefaultMaptilesPrefs.UsDetailedMap, /* Only works on zoom 4 and above. Doesn't work on Wind_10Meters */
      mapsConfig: [],
      mapSetWidth: LCUState.DefaultMaptilesPrefs.MapSetWidth, /* Formula: 8*xTiles Except: when usDetailed = true (zoom 6 is 4096) */
      overlayOpacity: LCUState.DefaultMaptilesPrefs.OverlayOpacity,
      mapBackground: worldoutlines,
    };
    this.handleApiResponse = this.handleApiResponse.bind(this);
    this.fetchAvailableTiles = this.fetchAvailableTiles.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.createMapsConfig = this.createMapsConfig.bind(this);
    this.fetchDataForMaps = this.fetchDataForMaps.bind(this);
    this.timestampToDatetime = this.timestampToDatetime.bind(this);
  }

  handleApiResponse(res) {
    if (res.ok === false) {
      throw new Error(
        JSON.stringify({
          Status: res.status,
          Text: res.statusText,
        })
      );
    } else {
      return res.json();
    }
  }

  fetchAvailableTiles() {
    const mapTileApi = `${this.state.habistackSvcUrl}${this.state.maptilesAvailable}`;

    fetch(mapTileApi)
      .then((res) => this.handleApiResponse(res))
      .then((data) => {
        this.setState(
          {
            imageObject: [this.state],
            imagesAvailable: data,
          },
          () => {
            this.fetchDataForMaps();
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching available map tiles:", error);
      });
  }

  fetchData(z, x, y, s, t, n) {
    fetch(`${this.state.habistackSvcUrl}${this.state.maptilesSvcQuery}/${n}/${t}/${z}/${x}/${y}`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Response not OK");
      })
      .then((data) => {
        const imageUrl = URL.createObjectURL(data);
        const imageObj = { url: imageUrl, index: s };
        let objExists = this.state.imageObject.find((o) => o.index === s);
        if (objExists) {
          console.log(objExists);
        } else {
          this.setState((prevState) => ({
            imageObject: [...prevState.imageObject, imageObj],
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching weather map:", error);
      });
  }

  createMapsConfig() {
    const zoom = this.state.zoom;
    const xTiles = this.state.xTiles;
    const yTiles = this.state.yTiles;
    const mapsConfig = [];
    for (let i = 0; i < yTiles; i++) {
      for (let j = 0; j < xTiles; j++) {
        const index = i * xTiles + j + 1;
        const config = [zoom, j, i, index];
        mapsConfig.push(config);
      }
    }
    return mapsConfig;
  }

  fetchDataForMaps() {
    const mapTileType = this.state.mapTileType;
    let usDetailedMap = this.state.usDetailedMap;
    usDetailedMap
      ? this.setState(() => ({ mapBackground: `${usaoutlines}` }))
      : this.setState(() => ({ mapBackground: `${worldoutlines}` }));
    const mapsConfig = this.createMapsConfig();
    let timeVar = "";
    console.log(this.state.imagesAvailable);
    this.state.imagesAvailable
      ? (timeVar = this.state.imagesAvailable.Temperature_2Meters[0])
      : null;
    timeVar !== undefined || null || ""
      ? (this.setState(() => ({ currentTime: timeVar })),
        mapsConfig.forEach(([z, x, y, s]) => {
          usDetailedMap
            ? z === 4 && ((s >= 83 && s <= 86) || (s >= 99 && s <= 102))
              ? this.fetchData(z, x, y, s, timeVar, mapTileType)
              : z === 5 && ((s >= 325 && s <= 332) || (s >= 357 && s <= 364) || (s >= 389 && s <= 396) || (s >= 421 && s <= 428))
              ? this.fetchData(z, x, y, s, timeVar, mapTileType)
              : z === 6 && ((s >= 1289 && s <= 1305) || (s >= 1353 && s <= 1368) || (s >= 1416 && s <= 1432) || (s >= 1480 && s <= 1496) || (s >= 1544 && s <= 1560) || (s >= 1608 && s <= 1624) || (s >= 1672 && s <= 1688) || (s >= 1736 && s <= 1752))
              ? this.fetchData(z, x, y, s, timeVar, mapTileType)
              : null
            : this.fetchData(z, x, y, s, timeVar, mapTileType);
        }))
      : null;
  }

  timestampToDatetime(timestamp) {
    // Convert timestamp to milliseconds
    var date = new Date(timestamp * 1000);

    // Extract components of the date and time
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);

    // Format the datetime as string
    var datetime = month + "-" + day + "-" + year + " " + hours + ":" + minutes + ":" + seconds;

    return datetime;
  }

  componentDidMount() {
    this.fetchAvailableTiles();
  }

  render() {
    const currentTime = this.timestampToDatetime(this.state.currentTime);
    const { imageObject } = this.state;
    const mapSetWidth = this.state.mapSetWidth;
    const mapBackground = this.state.mapBackground;
    const overlayOpacity = this.state.overlayOpacity;

    imageObject.sort(function (a, b) {
      return a.index - b.index;
    });

    return (
      <>
        {currentTime}
        <div
          className="outer-container"
          style={{
            "--mapwidth": `${mapSetWidth}px`,
            "--mapBackground": `url(${mapBackground})`,
          }}
        >
          <div className="flex-container">
            {imageObject.length > 0 ? (
              imageObject.map(({ url, index }, indexMap) =>
                url ? (
                  <div key={indexMap} style={{ opacity: `${overlayOpacity}` }}>
                    <img key={indexMap} src={url} alt={`Weather Map ${index}`} />
                  </div>
                ) : null
              )
            ) : (
              <p>Loading weather map...</p>
            )}
          </div>
        </div>
      </>
    );
  }
} 