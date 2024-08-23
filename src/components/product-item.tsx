import { ImageWithFallback } from "@/components/ImageWithFallback";
import { spaceImages } from "@/global/parameters";
import { ItemOrder } from "@/hooks/queries/useOrder";

type ProductItemProps = {
  data: ItemOrder;
};

export function ProductItem({ data }: ProductItemProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-x-2 px-0 py-2 ">
      <div className="flex gap-x-5">
        <div className="bg-white rounded-md overflow-hidden flex items-center justify-center h-20">
          <ImageWithFallback
            alt={data.produto.descricao}
            src={`${spaceImages}/Produtos/${
              data.produto?.imagemPreview
                ? data.produto.imagemPreview
                : data.produto.referencia + "_01"
            }_smaller`}
            width={130}
            height={100}
          />
        </div>

        <div className="flex flex-col">
          <h4>{data.produto.descricao}</h4>
          <span className="font-light text-xs">Cód. {data.produto.codigo}</span>
          <span className="font-light text-xs">
            Referência {data.produto.referencia}
          </span>
          <span className="font-light text-xs">
            Grade {data.produto.descricaoAdicional}
          </span>
          <span className="font-light text-xs">
            Valor unitário {data.valorUnitarioFormat}
          </span>
        </div>
      </div>

      <span className="font-bold mt-6 sm:mt-0">{data.quantidade} und</span>

      <span className="font-bold mt-6 sm:mt-0">{data.valorTotalFormat}</span>
    </div>
  );
}
