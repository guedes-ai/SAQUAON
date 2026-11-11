const svg =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>" +
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
  "<stop offset='0' stop-color='#004F8A'/><stop offset='1' stop-color='#4FA8D8'/></linearGradient></defs>" +
  "<rect width='800' height='500' fill='url(#g)'/>" +
  "<path d='M0 360 Q100 320 200 360 T400 360 T600 360 T800 360 V500 H0Z' fill='white' fill-opacity='.18'/>" +
  "<path d='M0 415 Q100 375 200 415 T400 415 T600 415 T800 415 V500 H0Z' fill='white' fill-opacity='.14'/>" +
  '</svg>';


export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
