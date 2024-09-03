import { ImageWithFallback } from "@/components/ImageWithFallback";
import { spaceImages } from "@/global/parameters";
import { ItemOrder } from "@/hooks/queries/useOrder";
import { cn } from "@/lib/utils";

type ProductItemProps = {
  data: ItemOrder;
  status?: string;
};

export function ProductItem({ data, status }: ProductItemProps) {
  const isQuantityDifferent = data.itemErp
    ? data.itemErp?.quantidade !== data.quantidade
    : false;

  return (
    <div className="flex flex-wrap justify-between items-center gap-x-2 px-0 py-1 mb-3">
      <div className="flex gap-x-5">
        <div className="bg-white rounded-md overflow-hidden flex items-center justify-center w-28 ">
          <ImageWithFallback
            className="h-28 w-full object-contain"
            alt={data.produto.descricao}
            src={`${spaceImages}/Produtos/${
              data.produto?.imagemPreview
                ? data.produto.imagemPreview
                : data.produto.referencia + "_01"
            }_smaller`}
            width={150}
            height={100}
          />
        </div>

        <div className="flex flex-col">
          <h4>{data.produto.descricao}</h4>
          <span className="font-light text-xs">Cód. {data.produto.codigo}</span>
          <span className="font-light text-xs">
            Referência: {data.produto.referencia}
          </span>
          <span className="font-light text-xs">
            Grade: {data.produto.descricaoAdicional}
          </span>
          <span className="font-light text-xs">
            Valor unitário: {data.valorUnitarioFormat}
          </span>
          <span className="font-light text-xs">
            Situação:{" "}
            {data.itemErp?.situacao === "Cancelado" ? (
              <b className={cn("font-bold text-red-500")}>
                {data.itemErp?.situacao ?? "Nada faturado"}
              </b>
            ) : status === "Recusado" ? (
              <b className={cn("font-bold text-purple-500")}>{status}</b>
            ) : (
              <b
                className={cn(
                  "font-bold",
                  data.itemErp?.situacao === "Faturado"
                    ? "text-green-500"
                    : "text-blue-500"
                )}
              >
                {data.itemErp?.situacao ?? "Nada faturado"}
              </b>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold mt-6 sm:mt-0",
            isQuantityDifferent && "line-through",
            isQuantityDifferent && "font-light",
            isQuantityDifferent && "text-red-500"
          )}
        >
          {data.quantidade} und
        </span>

        {isQuantityDifferent && (
          <span className="font-bold mt-6 sm:mt-0">
            {data.itemErp?.quantidade} und
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold mt-6 sm:mt-0",
            data.itemErp?.situacao === "Cancelado" && "line-through",
            data.itemErp?.situacao === "Cancelado" && "text-red-500"
          )}
        >
          {isQuantityDifferent
            ? data.itemErp?.valorTotalFormat
            : data.valorTotalFormat}
        </span>

        {data.itemErp?.situacao === "Cancelado" &&
          data.itemErp?.motivoCancelamento?.descricao && (
            <span className="font-light text-xs text-red-500">
              {data.itemErp?.motivoCancelamento?.descricao}
            </span>
          )}

        {data.itemErp?.situacao !== "Cancelado" &&
          status === "Recusado" &&
          data.itemErp?.motivoRecusa?.descricao && (
            <span className="font-light text-xs text-purple-500">
              {data.itemErp?.motivoRecusa?.descricao}
            </span>
          )}
      </div>
    </div>
  );
}
