function drawLogoComplete(two, x, y, radius) {
  var tri;
  for (var i = 0; i < 12; i++) {
    tri = two.makePolygon(x, y, radius, 3);
    tri.rotation = Math.PI / 6 * i;
    tri.stroke = 'black';
    tri.opacity = 0.5;
    tri.linewidth = 5;
  }
}

(function() {
  // Draw logo in initial canvas.
  var elem = document.getElementById("logo-complete");
  var params = { width: elem.clientWidth, height: elem.clientHeight };
  var two = new Two(params).appendTo(elem);

  drawLogoComplete(two, params.width / 2, params.height / 2, params.width / 3); 

  two.update();
})();
