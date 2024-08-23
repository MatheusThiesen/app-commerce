import { GroupInput } from "@/components/form-tailwind/GroupInput";
import { InputBase } from "@/components/form-tailwind/InputBase";
import { TextareaBase } from "@/components/form-tailwind/TextareaBase";
import {
  DetailBox,
  DetailBoxSubtitle,
  DetailBoxTitle,
  DetailContent,
  DetailGoBack,
  DetailHeader,
  DetailMain,
  DetailPage,
  DetailTitle,
} from "@/components/layouts/detail";
import { ScreenLoading } from "@/components/loading-screen";
import Head from "next/head";
import { useRouter } from "next/router";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { useClientOne } from "../../hooks/queries/useClients";

export default function Client() {
  const router = useRouter();
  const { codigo } = router.query;

  const { data: client, isLoading } = useClientOne(Number(codigo));

  if (isLoading || !client) return <ScreenLoading />;

  return (
    <>
      <Head>
        <title> Cliente | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll isGoBack title="Detalhes" />

      <DetailPage>
        <DetailHeader className="hidden lg:flex">
          <DetailGoBack />
          <DetailTitle>{client.razaoSocial}</DetailTitle>
        </DetailHeader>

        <DetailMain>
          <DetailContent
            secondaryColumn={
              <>
                <DetailBox>
                  <DetailBoxTitle>Classificação</DetailBoxTitle>

                  <InputBase
                    name="activity-field"
                    label="Ramo de Atividade"
                    value={client.ramoAtividade?.descricao}
                  />

                  <InputBase
                    name="concept"
                    label="Conceito"
                    value={client.conceito?.descricao}
                  />
                </DetailBox>

                <DetailBox>
                  <DetailBoxTitle>Endereço</DetailBoxTitle>

                  <InputBase
                    name="zip-code"
                    label="CEP"
                    value={client.cepFormat}
                  />

                  <InputBase name="uf" label="UF" value={client.uf} />

                  <InputBase name="city" label="Cidade" value={client.cidade} />

                  <InputBase
                    name="address"
                    label="Endereço"
                    value={client.logradouro}
                  />

                  <InputBase
                    name="addressNumber"
                    label="Número"
                    value={client.numero}
                  />

                  <TextareaBase
                    name="complement"
                    label="Complemento"
                    value={client.complemento}
                  />
                </DetailBox>

                <DetailBox className="w-full">
                  <DetailBoxTitle>Observação</DetailBoxTitle>

                  <TextareaBase
                    name="obs"
                    defaultValue={client.obs}
                    readOnly
                    className="h-40"
                  />
                </DetailBox>
              </>
            }
          >
            <DetailBox className="w-full">
              <div>
                <DetailBoxTitle>{client.razaoSocial}</DetailBoxTitle>
                <DetailBoxSubtitle>{client.cnpjFormat}</DetailBoxSubtitle>
              </div>
            </DetailBox>

            <DetailBox className="w-full">
              <DetailBoxTitle>Cadastro</DetailBoxTitle>

              <InputBase name="code" label="Código" value={client.codigo} />

              <InputBase name="cnpj" label="CNPJ" value={client.cnpjFormat} />

              <InputBase
                name="name"
                label="Nome fantasia"
                value={client.nomeFantasia}
              />

              <InputBase
                name="socialReason"
                label="Razão social"
                value={client.razaoSocial}
              />

              <InputBase
                name="stateRegistration"
                label="Inscrição Estadual"
                value={client.incricaoEstadual}
              />
            </DetailBox>

            <DetailBox className="w-full">
              <DetailBoxTitle>Contatos</DetailBoxTitle>

              <GroupInput>
                <InputBase name="email" label="E-mail" value={client.email} />
                <InputBase
                  name="email2"
                  label="E-mail 2"
                  value={client.email2}
                />
              </GroupInput>

              <InputBase
                name="cellPhone"
                label="Celular"
                value={client.celularFormat}
              />

              <GroupInput>
                <InputBase
                  name="phone"
                  label="Telefone"
                  value={client.telefoneFormat}
                />
                <InputBase
                  name="phone2"
                  label="Telefone 2"
                  value={client.telefone2Format}
                />
              </GroupInput>
            </DetailBox>
          </DetailContent>
        </DetailMain>
      </DetailPage>
    </>
  );
}
