import GeodreieckSvg from '../assets/geodreieck_modified.svg'

function Geodreieck() {
  let image = new Image()
  image.src = GeodreieckSvg as any
  return image
}

export default Geodreieck()
