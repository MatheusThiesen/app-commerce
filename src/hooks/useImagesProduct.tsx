import axios from "axios";
import xml2js from "xml2js";

interface useImagesProductProps {
  reference: string;
}

type ResponseXmlToJson = {
  ListBucketResult: {
    Contents: {
      Key: string[];
    }[];
  };
};

export const useImagesProduct = async ({
  reference,
}: useImagesProductProps) => {
  var images: string[] = [];
  const response = await axios(
    `https://alpar.sfo3.digitaloceanspaces.com/?prefix=Produtos%2F${reference}&max-keys=10`,
    {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );
  const xmlToJson = (await xml2js.parseStringPromise(
    response.data
  )) as ResponseXmlToJson;
  images = xmlToJson?.ListBucketResult?.Contents?.map(
    (key) => "https://alpar.sfo3.digitaloceanspaces.com" + "/" + key?.Key[0]
  );

  return images;
};
