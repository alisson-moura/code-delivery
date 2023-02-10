import { Button, Grid, MenuItem, Select, useForkRef } from "@mui/material";
import { Loader } from "google-maps";
import { useSnackbar } from "notistack";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { RouteExists } from "../errors/export";
import { getCurrentPosition } from "../util/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/map";
import { Route } from "../util/models";
import { NavBar } from "./navbar";
import { Socket, io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL as string;
const googleMapsLoader = new Loader(import.meta.env.VITE_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

export function Mapping() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const mapRef = useRef<Map>();
  const socketIoRef = useRef<Socket>();
  const { enqueueSnackbar } = useSnackbar();

  const finishedRoute = useCallback(
    (route: Route) => {
      enqueueSnackbar(`${route.title} finalizada.`, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (!socketIoRef.current?.connected) {
      socketIoRef.current = io(apiUrl);
    }

    const handler = (data: {
      routeId: string;
      clientId: string;
      position: { lat: number; long: number };
      finished: boolean;
    }) => {
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: Number(data.position.lat),
        lng: Number(data.position.long),
      });
      const route = routes.find((route) => route._id === data.routeId);
      if (data.finished && route) {
        finishedRoute(route);
        mapRef.current?.remove(route._id);
      }
    };

    socketIoRef.current?.on("new-position", handler);

    return () => {
      socketIoRef.current?.off("new-position", handler);
    };
  }, [finishedRoute, routes, selectedRoute]);

  useEffect(() => {
    fetch(`${apiUrl}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));

    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);
      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const route = routes.find((route) => route._id === selectedRoute);

      if (route && route._id) {
        try {
          const color = Math.floor(Math.random() * 10);
          mapRef.current?.addRoute(route._id, {
            currentMarkerOptions: {
              position: route.startPosition,
              icon: makeCarIcon(colors[color]),
            },
            endMarkerOptions: {
              position: route.endPosition,
              icon: makeMarkerIcon(colors[color]),
            },
          });
          socketIoRef.current?.emit("new-direction", {
            routeId: selectedRoute,
          });
        } catch (error) {
          if (error instanceof RouteExists) {
            enqueueSnackbar(`${route.title} já foi iniciado`, {
              variant: "error",
            });
            return;
          }
          throw error;
        }
      }
    },
    [selectedRoute, routes]
  );

  return (
    <Grid container style={{ width: "100%", height: "100%" }}>
      <Grid item xs={12} sm={3}>
        <NavBar />
        <form style={{ margin: "16px" }} onSubmit={startRoute}>
          <Select
            fullWidth
            displayEmpty
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value + "")}
          >
            <MenuItem value={0}>
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route) => (
              <MenuItem key={route._id} value={route._id}>
                {route.title}
              </MenuItem>
            ))}
          </Select>
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <Button color="primary" variant="contained" type="submit">
              <b>Iniciar corrida</b>
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" style={{ width: "100%", height: "100%" }}></div>
      </Grid>
    </Grid>
  );
}
