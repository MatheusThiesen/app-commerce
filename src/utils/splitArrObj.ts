export default function splitArrObj(base: any[], maximo: number) {
  var resultado = [[]];
  var grupo = 0;

  for (var indice = 0; indice < base.length; indice++) {
    if (resultado[grupo] === undefined) {
      resultado[grupo] = [];
    }

    //@ts-ignore
    resultado[grupo].push(base[indice]);

    if ((indice + 1) % maximo === 0) {
      grupo = grupo + 1;
    }
  }

  return resultado;
}
