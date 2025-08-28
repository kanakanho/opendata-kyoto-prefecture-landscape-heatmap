import maplibregl from 'maplibre-gl'

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json', // stylesheet location
  center: [135.77, 35.004], // starting position [lng, lat]
  zoom: 12, // starting zoom
})

map.on('load', () => {
  map.addSource('polygons', {
    type: 'geojson',
    data: './population_heatmap.geojson',
    attribution: '<a href="https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto" target="_blank" rel=”noreferrer noopener”>「全国の人流オープンデータ」（国土交通省）（https://www.geospatial.jp/ckan/dataset/mlit-1km-fromto）を加工して作成</a>',
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
    attribution: '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P12-v2_2.html" target="_blank" rel=”noreferrer noopener”>「国土数値情報（観光資源データ）（国土交通省）（https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P12-v2_2.html）を加工して作成</a>',
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
    const description = `<strong>${features[0].properties.P12_002}</strong><br>${features[0].properties.P12_005}`

    new maplibregl.Popup().setLngLat([coordinatePoint[0], coordinatePoint[1]]).setHTML(description).addTo(map)
  })
})
