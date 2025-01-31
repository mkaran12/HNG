module.exports = (temp, product) => {
  let output = temp.replace(/{%EMAIL%}/g, product.email);
  output = output.replace(/{%CURRENTTIME%}/g, product.currentTime);
  output = output.replace(/{%GITHUB%}/g, product.github);
  return output;
};
