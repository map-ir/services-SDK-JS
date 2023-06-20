import { qs, convertAllPropsToString } from "./utils";

import type { Route, Waypoint } from "osrm";
import type { LngLat } from "./types";
import type Mapir from "./";

export default function route(
  this: Mapir,
  locations: LngLat[],
  type: RouteType = "car",
  options: IRouteOptions = {}
) {
  const defaultOptions = {
    alternatives: true,
    steps: true,
    overview: false,
  };
  const actualType = (
    {
      car: "route",
      walking: "walking",
      bicycle: "bicycle",
    } as Record<RouteType, string>
  )[type];

  try {
    const locationsString = locations
      .map((lnglat) => [lnglat.lng, lnglat.lat].join())
      .join(";");

    const actualOptions = Object.assign(defaultOptions, options);

    const q = qs(convertAllPropsToString(actualOptions as IRouteOptions));
    const url = new URL(
      `/routes/${actualType}/v1/driving/${locationsString}?${q}`,
      this.baseURL
    );

    return fetch(url, {
      method: "GET" as RouteMethod,
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res as IRouteResponse | undefined);
  } catch (err) {
    console.error("🚀 ~ file: route.ts:34 ~ err:", err);
    return undefined;
  }
}

//** Types:  */ */

export type RouteType = "car" | "walking" | "bicycle";

export interface IRouteOptions extends Record<string, unknown> {
  alternatives?: boolean;
  steps?: boolean;
  overview?: "full" | boolean;
  geometries?: "polyline6";
}

export type RouteMethod = "GET";
export interface IStaticMapPayload extends Record<string, string> {
  width: `${number}`;
  height: `${number}`;
  markers: `color:${"red" | "blue"}|${number},${number}|${string}`;
  zoom_level: `${number}`;
}

export interface IRouteResponse {
  code: "ok";
  routes: Route[];
  waypoints: Waypoint[];
}
