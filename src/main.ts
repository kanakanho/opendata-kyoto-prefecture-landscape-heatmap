import maplibregl from 'maplibre-gl'

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json', // stylesheet location
  center: [136.9, 35.0], // starting position [lng, lat]
  zoom: 9, // starting zoom
})

map.on('load', () => {
  map.addSource('polygons', {
    type: 'geojson',
    data: './population_heatmap.geojson',
  })
  map.addLayer({
    id: 'polygons-fill',
    type: 'fill',
    source: 'polygons',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'population'],
        0,
        '#f7fbff',
        100,
        '#deebf7',
        500,
        '#c6dbef',
        1000,
        '#9ecae1',
        5000,
        '#6baed6',
        10000,
        '#4292c6',
        20000,
        '#2171b5',
        50000,
        '#08519c',
      ],
      'fill-opacity': 0.1,
    },
  })
  map.addLayer({
    id: 'polygons-outline',
    type: 'line',
    source: 'polygons',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1,
    },
  })

  map.addSource('point', {
    type: 'geojson',
    data: 'kyoto.geojson',
  })
  map.addLayer({
    id: 'point',
    type: 'circle',
    source: 'point',
    paint: {
      'circle-radius': 12,
      'circle-color': '#ca0048',
    },
  })

  map.on('click', 'point', (e) => {
    const features = e.features
    if (!features) {
      return
    }
    const coordinatePoint = (features[0].geometry as GeoJSON.Point).coordinates.slice()
    const description = features[0].properties.タイトル

    new maplibregl.Popup().setLngLat([coordinatePoint[0], coordinatePoint[1]]).setHTML(description).addTo(map)
  })
})
