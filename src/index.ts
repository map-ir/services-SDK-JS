import { qs } from "./utils";

import route from "./route";

import type { Point } from "geojson";
import type { LngLat } from "./types";

export default class Mapir {
  apiKey: string = "";
  baseURL?: string = "https://map.ir";

  constructor(opt?: IConstructorOptions) {
    const { apiKey, baseURL } = opt ?? {};
    if (apiKey) this.apiKey = apiKey;
    if (baseURL) this.baseURL = baseURL;
  }

  search(text: string, location: LngLat, autocomplete?: boolean) {
    const url = new URL(
      `/search${autocomplete ? "/autocomplete" : ""}`,
      this.baseURL
    );

    return fetch(url, {
      method: "POST" as SearchMethod,
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        text,
        returnid: true,
        location: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      } as ISearchPayload),
    })
      .then((res) => res.json())
      .then((res) => res as ISearchResult | undefined);
  }

  reverseGeocode(location: LngLat) {
    const q = qs({
      lat: location.lat.toString(),
      lon: location.lng.toString(),
    } as IReversePayload);
    const url = new URL(`/reverse?${q}`, this.baseURL);

    return fetch(url, {
      method: "GET" as ReverseMethod,
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res as IReverseResult | undefined);
  }

  public route = route;

  staticMap(
    location: [LngLat] | [LngLat, LngLat],
    options?: IStaticMapOptions
  ) {
    const {
      width = 700,
      height = 500,
      zoom = 13,
      colors = ["red", "red"],
      labels,
    } = options ?? {};

    const markers = location
      .map((loc, idx) => {
        return [
          `color:${colors[idx]}`,
          [loc.lng, loc.lat].join(),
          labels?.[idx],
        ]
          .filter(Boolean)
          .join("|");
      })
      .join();

    const q = qs({
      markers,
      width: String(width),
      height: String(height),
      zoom_level: String(zoom),
    } as IStaticMapPayload);
    const url = new URL(`/static?${q}`, this.baseURL);

    return fetch(url, {
      method: "GET" as StaticMapMethod,
      headers: {
        "x-api-key": this.apiKey,
      },
    })
      .then((res) => res.blob())
      .then((res) => res as StaticMapResult | undefined);
  }
}

export interface IConstructorOptions {
  apiKey?: string;
  baseURL?: string;
}

//** Search v1  */ */

export type SearchMethod = "POST";
export interface ISearchPayload {
  location: Point;
  returnid: boolean;
  text: string;
}
export interface ISearchResult {
  "odata.count": number;
  request_id: number;
  value: Array<{
    Address: string;
    City: string;
    Coordinate: { lat: number; lon: number };
    FClass: string;
    Id: string;
    Province: string;
    Text: string;
    Title: string;
    Type: string;
  }>;
}

//** Reverse Geocode  */ */

export type ReverseMethod = "POST";
export interface IReversePayload extends Record<string, string> {
  lat: `${number}`;
  lon: `${number}`;
}
export interface IReverseResult {
  address: string;
  address_compact: string;
  city: string;
  country: string;
  county: string;
  district: string;
  geom: Point;
  last: string;
  name: string;
  neighbourhood: string;
  penult: string;
  plaque: string;
  poi: string;
  postal_address: string;
  postal_code: string;
  primary: string;
  province: string;
  region: string;
  rural_district: string;
  village: string;
}

//** Static Map  */ */
export interface IStaticMapOptions {
  width?: number | `${number}`;
  height?: number | `${number}`;
  colors?: [string] | [string, string];
  labels?: [string] | [string, string];
  zoom?: number | `${number}`;
}
export type StaticMapMethod = "GET";
export interface IStaticMapPayload extends Record<string, string> {
  width: `${number}`;
  height: `${number}`;
  markers: `color:${"red" | "blue"}|${number},${number}|${string}`;
  zoom_level: `${number}`;
}
export type StaticMapResult = Blob;
