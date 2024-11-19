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
}: useImagesProductProps) => {
  var images: string[] = [];
  const response = await axios(
    `${spaceImages}/?prefix=Produtos%2F${reference}&max-keys=30`,
    {
      method: "GET",
    }
  );

  try {
    const xmlToJson = (await xml2js.parseStringPromise(
      response.data
    )) as ResponseXmlToJson;

    images = xmlToJson?.ListBucketResult?.Contents?.map((key) => key?.Key[0]);

    return images
      .filter((f) => !f.endsWith("_smaller"))
      .filter(
        (f) =>
          f.split("/")[1].split("_")[0].toLocaleUpperCase() ===
          reference.toLocaleUpperCase()
      )
      .map((image) => `${spaceImages}/${image}`);
  } catch (error) {
    return [""];
  }
};
