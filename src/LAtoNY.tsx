import { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

// LA and NY coordinates
const LA_COORDS: [number, number] = [-118.2437, 34.0522];
const NY_COORDS: [number, number] = [-74.006, 40.7128];

// Create a curved line (great circle) between LA and NY
const lineCoordinates = turf.greatCircle(
  turf.point(LA_COORDS),
  turf.point(NY_COORDS),
  { npoints: 100 }
).geometry.coordinates as [number, number][];

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const LAtoNY = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { delayRender, continueRender } = useDelayRender();
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  const [handle] = useState(() => delayRender("Loading map..."));
  const [map, setMap] = useState<Map | null>(null);

  // Animation phases (in seconds)
  const zoomOutDuration = 3; // 0-3s: zoom out from LA
  const lineDuration = 4; // 3-7s: draw line and follow camera
  const totalDuration = durationInFrames / fps;

  useEffect(() => {
    const _map = new Map({
      container: ref.current!,
      zoom: 10,
      center: LA_COORDS,
      pitch: 0,
      bearing: 0,
      style: "mapbox://styles/mapbox/standard",
      interactive: false,
      fadeDuration: 0,
    });

    _map.on("style.load", () => {
      // Hide all features from the Mapbox Standard style
      const hideFeatures = [
        "showRoadsAndTransit",
        "showRoads",
        "showTransit",
        "showPedestrianRoads",
        "showRoadLabels",
        "showTransitLabels",
        "showPlaceLabels",
        "showPointOfInterestLabels",
        "showPointsOfInterest",
        "showAdminBoundaries",
        "showLandmarkIcons",
        "showLandmarkIconLabels",
        "show3dObjects",
        "show3dBuildings",
        "show3dTrees",
        "show3dLandmarks",
        "show3dFacades",
      ];
      for (const feature of hideFeatures) {
        _map.setConfigProperty("basemap", feature, false);
      }

      _map.setConfigProperty("basemap", "colorMotorways", "transparent");
      _map.setConfigProperty("basemap", "colorRoads", "transparent");
      _map.setConfigProperty("basemap", "colorTrunks", "transparent");

      // Add route line source (initially empty)
      _map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        },
      });

      // Add route line layer
      _map.addLayer({
        type: "line",
        source: "route",
        id: "route-line",
        paint: {
          "line-color": "#FF4444",
          "line-width": 6,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });

      // Add markers for LA and NY
      _map.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "Los Angeles" },
              geometry: { type: "Point", coordinates: LA_COORDS },
            },
            {
              type: "Feature",
              properties: { name: "New York" },
              geometry: { type: "Point", coordinates: NY_COORDS },
            },
          ],
        },
      });

      _map.addLayer({
        id: "city-markers",
        type: "circle",
        source: "markers",
        paint: {
          "circle-radius": 12,
          "circle-color": "#FF4444",
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
        },
      });

      _map.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "markers",
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 24,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#FFFFFF",
          "text-halo-color": "#000000",
          "text-halo-width": 2,
        },
      });
    });

    _map.on("load", () => {
      continueRender(handle);
      setMap(_map);
    });
  }, [handle, continueRender]);

  // Animation effect
  useEffect(() => {
    if (!map) return;

    const animationHandle = delayRender("Animating map...");
    const currentTime = frame / fps;

    // Phase 1: Zoom out from LA (0-3s)
    if (currentTime <= zoomOutDuration) {
      const zoomProgress = interpolate(
        currentTime,
        [0, zoomOutDuration],
        [0, 1],
        {
          easing: Easing.inOut(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

      const zoom = interpolate(zoomProgress, [0, 1], [10, 4]);

      map.setCenter(LA_COORDS);
      map.setZoom(zoom);

      // Clear line during zoom out
      const source = map.getSource("route") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        });
      }
    }
    // Phase 2: Draw line and follow camera (3-7s)
    else if (currentTime <= zoomOutDuration + lineDuration) {
      const lineProgress = interpolate(
        currentTime,
        [zoomOutDuration, zoomOutDuration + lineDuration],
        [0, 1],
        {
          easing: Easing.inOut(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );

      // Get the current point along the route
      const routeLine = turf.lineString(lineCoordinates);
      const routeDistance = turf.length(routeLine);
      const currentDistance = Math.max(0.001, routeDistance * lineProgress);
      const slicedLine = turf.lineSliceAlong(routeLine, 0, currentDistance);

      // Update line
      const source = map.getSource("route") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(slicedLine);
      }

      // Get current position along line for camera
      const currentPoint = turf.along(routeLine, currentDistance);
      const currentCoords = currentPoint.geometry.coordinates as [
        number,
        number,
      ];

      // Keep zoom at 4 and follow the line
      map.setCenter(currentCoords);
      map.setZoom(4);
    }
    // Phase 3: Stay at NY (7s+)
    else {
      // Show complete line
      const source = map.getSource("route") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: lineCoordinates,
          },
        });
      }

      map.setCenter(NY_COORDS);
      map.setZoom(4);
    }

    map.once("idle", () => continueRender(animationHandle));
  }, [frame, fps, map, delayRender, continueRender]);

  const style: React.CSSProperties = useMemo(
    () => ({ width, height, position: "absolute" }),
    [width, height]
  );

  return <AbsoluteFill ref={ref} style={style} />;
};
