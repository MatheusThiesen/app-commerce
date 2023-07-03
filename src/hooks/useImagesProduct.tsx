import axios from "axios";
import xml2js from "xml2js";
import { spaceImages } from "../global/parameters";

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
    `${spaceImages}/?prefix=Produtos%2F${reference}&max-keys=10`,
    {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  );

  try {
    const xmlToJson = (await xml2js.parseStringPromise(
      response.data
    )) as ResponseXmlToJson;
    images = xmlToJson?.ListBucketResult?.Contents?.map(
      (key) => spaceImages + "/" + key?.Key[0]
    );

    return images;
  } catch (error) {
    return [""];
  }
};
