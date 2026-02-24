import L, { LatLngExpression } from "leaflet";
import React, { FunctionComponent, useEffect } from "react";
import { MapContainer, TileLayer, Popup, useMap } from "react-leaflet";
import { CustomMarker, MarkerData } from "./marker-components";
import { IMarker } from "@/lib/db-types";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  position: LatLngExpression;
  loadData: () => void;
  markers: IMarker[];
  setCreateMarkerDialogOpen: (v: boolean) => void;
  globalMap: L.Map | null
  clickedLatLngRef: React.RefObject<L.LatLng | null>
  setGlobalMap: (T: L.Map) => void
  // handleContextMenu: (event: React.MouseEvent) => void;
}

const MapComponent: FunctionComponent<MapComponentProps> = ({
  position,
  loadData,
  markers,
  setCreateMarkerDialogOpen,
  globalMap,
  clickedLatLngRef,
  setGlobalMap
}) => {

  const handleContextMenu = (event: React.MouseEvent) => {

    // Es crucial que el MapContainer tenga un ID para que L.DomUtil.get funcione
    const mapContainer = L.DomUtil.get('map-container');
    if (!mapContainer) return;

    // Obtener las coordenadas del píxel del clic dentro del contenedor del mapa
    const mapBounds = mapContainer.getBoundingClientRect();
    const x = event.clientX - mapBounds.left;
    const y = event.clientY - mapBounds.top;

    // Crear un punto de píxel de Leaflet
    const pixelPoint = L.point(x, y);

    // Obtener la instancia del mapa usando useMap y un ref para asegurarse de que esté disponible
    const map = globalMap; // Acceso directo al objeto Leaflet Map
    // (Esto es un hack; la forma recomendada es useMap())


    if (map) {
      // Convertir las coordenadas de píxel a coordenadas LatLng del mapa
      const latlng = map.containerPointToLatLng(pixelPoint);
      clickedLatLngRef.current = latlng;
    }

    // El `onOpenChange` del ContextMenu raíz controlará el `setIsContextMenuOpen(true)`
    // aquí no es necesario llamarlo explícitamente.
  };

  function HandlerMap() {
    const map = useMap(); // Obtiene la instancia de Leaflet Map
    // setGlobalMap(map)

    useEffect(() => {
      // Para cerrar el menú si el mapa se mueve o hace zoom
      const closeMenuOnMapInteraction = () => {

      };

      setGlobalMap(map)
      map.on('moveend', closeMenuOnMapInteraction);
      map.on('zoomend', closeMenuOnMapInteraction);

      return () => {
        map.off('moveend', closeMenuOnMapInteraction);
        map.off('zoomend', closeMenuOnMapInteraction);
      };
    }, [map]); // Dependencia: la instancia del mapa

    return null;
  }


  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={handleContextMenu}>




        {/* <Loading /> */}
        <MapContainer id="map-container" center={position} zoom={13} className="z-0 h-screen w-screen fixed left-0 top-0">
          <TileLayer
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          // className="invert"

          />

          <HandlerMap />

          {markers.map((marker, idx) => {


            return (
              <CustomMarker key={idx} position={[marker.lat, marker.lng] as L.LatLngExpression}> {/* Usa tu icono personalizado o el predeterminado */}
                <Popup className="w-max">

                  {/* Marcador en: <br /> Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)} */}
                  <MarkerData {...marker} onDelete={() => loadData()} onUpdate={() => loadData()} />
                </Popup>
              </CustomMarker>
            )
          }
          )}

        </MapContainer>
      </ContextMenuTrigger>
      <ContextMenuContent onContextMenu={x => x.preventDefault()}>
        <ContextMenuItem
          // onClick={handleAddPoint}
          onClick={() => { setCreateMarkerDialogOpen(true) }}
        >
          Crear marca aquí
        </ContextMenuItem>

      </ContextMenuContent>
    </ContextMenu>
  );
}

export default MapComponent;