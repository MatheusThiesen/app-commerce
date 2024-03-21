import axios from "axios";
import xml2js from "xml2js";
import { spaceImages } from "../global/parameters";

interface useImagesProductProps {
  reference: string;
  images?: string[];
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
  images: imagesStorage,
}: useImagesProductProps) => {
  // if (imagesStorage && imagesStorage.length > 0) {
  //   return imagesStorage.map((item) => `${spaceImages}/Produtos/${item}`);
  // }

  var images: string[] = [];
  const response = await axios(
    `${spaceImages}/?prefix=Produtos%2F${reference}&max-keys=30`,
    {
      method: "GET",
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Access-Control-Allow-Headers": "*",
      //   "Access-Control-Allow-Credentials": "true",
      // },
    }
  );

  try {
    const xmlToJson = (await xml2js.parseStringPromise(
      response.data
    )) as ResponseXmlToJson;

    images = xmlToJson?.ListBucketResult?.Contents?.map((key) => key?.Key[0]);

    return images
      .filter((f) => !f.endsWith("_smaller"))
      .filter((f) =>
        imagesStorage?.length ?? 0 > 0
          ? imagesStorage?.map((item) => `Produtos/${item}`).includes(f)
          : true
      )
      .map((image) => `${spaceImages}/${image}`);
  } catch (error) {
    return [""];
  }
};
