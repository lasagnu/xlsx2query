function generateRandomID() {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default generateRandomID;
