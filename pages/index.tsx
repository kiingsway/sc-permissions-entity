import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ReportTable from '../src/components/ReportTable';
import { Permission, fieldGroupsList, roleAssignmentsList } from '../mocks/sitePermDefinition';
import { consoleGroup, getNomeEntidade, getRoleIdsAndNames, isSameArray, joinAnd } from '../src/components/helpers';

enum TipoEntidade {
  Site = "Site",
  Lista = "Lista/Biblioteca",
  Item = "Pasta/Item de Lista/Biblioteca"
}

export default function Home() {

  const preData = {
    sitePermissions: Permission as ISiteDefinition[],
    fieldGroups: fieldGroupsList as IFieldGroup[],
    roleAssignments: roleAssignmentsList as IRoleAssignmentsList,
  }

  const relatorio = gerarRelatorio(preData);

  return (
    <>
      <Head>
        <title>SC Permissões</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <ReportTable relatorio={relatorio} />
        </div>
      </main>
    </>
  )
}

function gerarRelatorio(preData: IPreData) {

  let report: IItemReport[] = [];

  preData.sitePermissions.forEach(item => {

    const DefPermissions = {
      [`${TipoEntidade.Site}`]: item.SitePermissions,
      [`${TipoEntidade.Lista}`]: item.ListPermissions,
      [`${TipoEntidade.Item}`]: item.ItemPermissions,
    };

    const Permissions: IPermissions = DefPermissions[item.TipoEntidade];

    if (typeof Permissions?.HasUniqueRoleAssignments === "boolean") {
      report.push(reportInheritance(item, Permissions.HasUniqueRoleAssignments));
      report = report.concat(reportPermissions(item, preData));
    }
    else report.push(reportError(item));

  });

  return report;
}

function reportError(perm: ISiteDefinition) {

  return {
    IdDefinicao: perm.Id,
    Site: perm.URLSite.Title,
    Entidade: perm.TipoEntidade,
    NomeEntidade: getNomeEntidade(perm),
    Verificacao: "❌ Erro na verificação",
    HerdaPermissao: null,
    DeveriaHerdarPermissao: null,
    Lista: null,
    IdItem: null,
    TemPermissao: null,
    DeveriaTerPermissao: null,
    Erro: true,
    Mensagem: "Não foi possível verificar a permissão desse item"
  }
}

function reportInheritance(perm: ISiteDefinition, hasUniqueRoleAssignments: boolean) {

  const HerdaPermissao = !hasUniqueRoleAssignments;
  const DeveriaHerdarPermissao = perm.HerdaPermissoesPai;

  const Erro = perm.TipoEntidade === TipoEntidade.Site ?
    HerdaPermissao !== DeveriaHerdarPermissao && Boolean(perm.SitePermissions.ParentWeb) :
    HerdaPermissao !== DeveriaHerdarPermissao;

  enum txt {
    herda = "herdando permissões do pai",
    unica = "com permissões exclusivas"
  }

  const cond = {
    herda: HerdaPermissao ? txt.herda : txt.unica,
    deveria: DeveriaHerdarPermissao ? txt.herda : txt.unica
  }

  let Mensagem = Erro ? `${perm.TipoEntidade} está ${cond.herda} e não deveria. O correto é estar ${cond.deveria}.` : null;
  if (!Erro && !Boolean(perm.SitePermissions?.ParentWeb) && perm.TipoEntidade === TipoEntidade.Site) Mensagem = 'Não será necessário verificar herança de permissões pois essa entidade já é a entidade máxima (site)'

  return {
    IdDefinicao: perm.Id,
    Site: perm.URLSite.Title,
    Entidade: perm.TipoEntidade,
    NomeEntidade: getNomeEntidade(perm),
    Verificacao: "Herança da permissão",
    HerdaPermissao,
    DeveriaHerdarPermissao,
    Lista: null,
    IdItem: null,
    TemPermissao: HerdaPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
    DeveriaTerPermissao: DeveriaHerdarPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
    Erro,
    Mensagem
  }

}

function reportPermissions(perm: ISiteDefinition, preData: IPreData) {

  /**
   * Passa por todos os grupos da definição.
   * Para cada grupo, verificar se o grupo não tem permissão nenhuma definida.
   * Caso realmente não tenha, verificar se o site possui permissão. Caso possua, enviar mensagem de erro. Caso não possua, mensagem de sucesso de que realmente não deveria ter permissões.
   * Caso o grupo tenha permissões definidas, verificar se a entidade possui alguma permissão para esse grupo, caso não tiver, enviar mensagem de erro dizendo que grupo não possui permissão onde na verdade deveria ter
   * Caso o grupo tenha permissões definidas, verificar se possui os mesmos níveis de permissão da definição. Caso tenha, enviar mensagem de sucesso, caso não tenha, enviar mensagem de erro dizendo que as permissões estão diferentes.
   * 
   * Também verificar o tamanho de grupos com definição na entidade e a quantidade real de permissões que a entidade possui. Caso números diferentes, enviar menagem de erro.
   */

  let reports: IItemReport[] = [];

  const report: IItemReport = {
    IdDefinicao: perm.Id,
    Site: perm.URLSite.Title,
    Entidade: perm.TipoEntidade,
    NomeEntidade: getNomeEntidade(perm),
    Verificacao: "Grupo",
    HerdaPermissao: true,
    DeveriaHerdarPermissao: true,
    Lista: null,
    IdItem: null,
    TemPermissao: null,
    DeveriaTerPermissao: null,
    Erro: true,
    Mensagem: ""
  }

  // Definindo os grupos que serão verificados na entidade.
  const groups = getRoleIdsAndNames(preData, perm);

  const RoleAss = {
    [`${TipoEntidade.Site}`]: perm.SitePermissions.RoleAssignments,
    [`${TipoEntidade.Lista}`]: perm?.ListPermissions?.RoleAssignments,
  }
  const Role = RoleAss[perm.TipoEntidade];
  let RoleAssignments: IRoleAssignment[] = Array.isArray(Role) && Role && Role?.length ? Role : [];
  RoleAssignments = RoleAssignments.filter(r => r.RoleDefinitionBindings.filter(d => d.Name !== "Acesso Limitado" && d.Name !== "Limited Access").length);

  const groupReports: any[] = groups.map(g => {
    
    const permOnSite: IRoleAssignment = RoleAssignments.filter(r => r.Member.Title === g.Title)[0];
    const permOnSiteNames = permOnSite ? permOnSite.RoleDefinitionBindings.filter(r => r.Name !== "Acesso Limitado").map(r => r.Name).sort() : null
    const permOnSiteIds = permOnSite ? permOnSite.RoleDefinitionBindings.filter(r => r.Name !== "Acesso Limitado").map(r => r.Id).sort() : null

    // Verificar se grupo da definição está preenchido.
    if (g.RoleIds && g.RoleIds.length) {
      // Caso na definição esteja preenchido, verificar se grupo possui permissão no site.
      if (permOnSite) {
        // Caso possua, verificar se os níveis de permissões setados para ele no site estão iguais da definição.
        const Erro = !isSameArray(g?.RoleIds, permOnSiteIds);
        // Caso não possua permissão no site ou os níveis de permissões setados estejam diferentes, enviar um erro.
        const Mensagem = Erro ? `Grupo não possui as mesmas permissões na entidade. Deveria ter as permissões: ${joinAnd(g.RoleNames)}. Mas possui: ${joinAnd(permOnSiteNames)}` : "";

        return {
          ...report,
          Mensagem,
          Erro,
          Verificacao: `Grupo: "${g.Title}"`,
          TemPermissao: joinAnd(g.RoleNames),
          DeveriaTerPermissao: joinAnd(permOnSiteNames),
        };

      } else {
        // Caso não possua permissão no site ou os níveis de permissões setados estejam diferentes, enviar um erro.
        const Erro = !Boolean(permOnSite);
        const Mensagem = Erro ? "Grupo não possui permissão na entidade." : "";

        return {
          ...report,
          TemPermissao: joinAnd(g.RoleNames),
          DeveriaTerPermissao: joinAnd(permOnSiteNames),
          Verificacao: `Grupo: "${g.Title}"`,
          Erro,
          Mensagem
        };
      }
    }
    // Caso não esteja preenchido, verificar permissões no site.
    else {
      const Erro = Boolean(permOnSite);
      const Mensagem = Erro ? `O grupo está definido para não ter nenhuma permissão, entretanto a entidade possui permissão para esse grupo. As permissões: ${joinAnd(permOnSiteNames)}.` : "O grupo não possui permissão na entidade";
      if (Erro) return {
        ...report,
        Verificacao: `Grupo: "${g.Title}"`,
        Erro,
        Mensagem,
        TemPermissao: "-- nenhuma --",
        DeveriaTerPermissao: permOnSiteNames ? joinAnd(permOnSiteNames) : '-- nenhuma --',
      }
      else return null;
    }

  }).filter(i => i !== null);

  const qtdPermissoesDefinidas = groups.filter(g => g.RoleSpIds).length;
  const qtdPermissoesNaEntidade = RoleAssignments.length;

  if (qtdPermissoesDefinidas !== qtdPermissoesNaEntidade) {
    reports.push({
      ...report,
      Erro: true,
      Verificacao: "Quantidade de permissões na entidade",
      Mensagem: `A entidade possui permissões para grupos que não estão definidos nas colunas. Quantidade de colunas de grupos definidas: ${qtdPermissoesDefinidas}. Quantidade de permissões na entidade: ${qtdPermissoesNaEntidade}`,
      TemPermissao: `${qtdPermissoesNaEntidade} permissões aplicadas nessa entidade`,
      DeveriaTerPermissao: `${qtdPermissoesDefinidas} permissões aplicadas na definição`,
    })
  }

  reports = reports.concat(groupReports);

  return reports
}