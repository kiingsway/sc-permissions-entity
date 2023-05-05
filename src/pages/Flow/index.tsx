import React, { useEffect, useRef, useState } from 'react';
import { GetDefinition, GetDefinitionFields, GetRoleAssignments, GetSites } from '../../components/helpers/requests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const env = 'PROD';

export default function Flow() {

  const [spData, setSpData] = useState<ISPData>({ Definition: undefined, RoleAssignments: undefined, DefinitionFields: undefined, Sites: undefined });
  const [loading, setLoading] = useState(false);
  const toastId = useRef<any>(null);

  function handleData() {
    setLoading(true);
    toastId.current = toast.loading('Carregando...', { autoClose: false });

    Promise.all([GetDefinition(env), GetRoleAssignments(env), GetDefinitionFields(env), GetSites(env)])
      .then(responses => {

        const [Def, Role, Fields, SitesData] = responses;

        const Definition = Def.data.value
        const RoleAssignments = Role.data.value
        const DefinitionFields = Fields.data.value
        const Sites = SitesData.data.value

        setSpData({ Definition, RoleAssignments, DefinitionFields, Sites });
      })
      .finally(() => {
        setLoading(false);
        toast.dismiss(toastId.current);
        toastId.current = toast.success('Carregado com sucesso!', { autoClose: 2500 });
      })
  }

  useEffect(handleData, []);

  const preDados: IPreDados = {
    permissoesEntidade: spData.Definition as unknown as ISiteDefinition[],
    gruposCampos: (spData?.DefinitionFields || []) as IFieldGroup[],
    niveisPermissoes: spData?.RoleAssignments as IRoleAssignmentsList
  }

  console.log('ObterRelatorio', ObterRelatorio(preDados));

  return (
    <div>
      {loading ? 'Carregando...' : null}
      <ToastContainer
        position='top-center'
        theme='dark'
      />
      <pre>
        {JSON.stringify(spData.Sites, null, 2)}
      </pre>
    </div>
  )
}

function ObterRelatorio(preDados: IPreDados) {


  const TipoEntidade = {
    Site: "Site",
    Lista: "Lista/Biblioteca",
    Item: "Pasta/Item de Lista/Biblioteca"
  }

  function gerarRelatorioPermissoes(dados: IPreDados) {

    let relatorio: IItemReport[] = [];

    // Para cada item da definição de permissões.
    dados.permissoesEntidade.forEach(itemDefinicao => {

      const heranca = verificarHeranca(itemDefinicao);
      const grupos = verificarPermissoesGrupos(itemDefinicao, dados);
      relatorio = relatorio.concat(heranca, grupos);
    });

    return relatorio;
  }

  function verificarHeranca(item: ISiteDefinition): IItemReport[] {

    const todasPermissoes = {
      [`${TipoEntidade.Site}`]: item.SitePermissions,
      [`${TipoEntidade.Lista}`]: item.ListPermissions,
      [`${TipoEntidade.Item}`]: item.ItemPermissions,
    };

    // Seleciona a permissão da entidade atual.
    const permissoes = todasPermissoes[item.TipoEntidade];

    const HerdaPermissao = !permissoes?.HasUniqueRoleAssignments;
    const DeveriaHerdarPermissao = item.HerdaPermissoesPai;

    // Apenas verifica a herança de site for um subsite.
    const Erro = item.TipoEntidade === TipoEntidade.Site ?
      HerdaPermissao !== DeveriaHerdarPermissao && Boolean(item.SitePermissions.ParentWeb) :
      HerdaPermissao !== DeveriaHerdarPermissao;

    const txt = {
      herda: "herdando permissões do pai",
      unica: "com permissões exclusivas"
    };

    const cond = {
      herda: HerdaPermissao ? txt.herda : txt.unica,
      deveria: DeveriaHerdarPermissao ? txt.herda : txt.unica
    };

    const mensagens = {
      Erro: `${item.TipoEntidade} está ${cond.herda} e não deveria. O correto é estar ${cond.deveria}.`,
      EntMaxima: 'Não será necessário verificar herança de permissões pois essa entidade já é a entidade máxima (site)',
    };

    const ehEntidadeMaxima = !Boolean(item.SitePermissions?.ParentWeb) && item.TipoEntidade === TipoEntidade.Site;

    const Mensagem = Erro ? mensagens.Erro : (ehEntidadeMaxima ? mensagens.EntMaxima : null);

    return [{
      IdDefinicao: item.Id,
      Site: item.URLSite.URLSite,
      Entidade: item.TipoEntidade,
      IdItem: item.Title,
      Lista: null,
      NomeEntidade: obterNomeEntidade(item),
      Verificacao: "Herança da permissão",
      HerdaPermissao,
      DeveriaHerdarPermissao,
      TemPermissao: HerdaPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
      DeveriaTerPermissao: DeveriaHerdarPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
      Erro,
      Mensagem
    }];
  }

  function verificarPermissoesGrupos(item: ISiteDefinition, { gruposCampos, niveisPermissoes }: IPreDados): IItemReport[] {

    /**
     * Passa por todos os grupos da definição.
     * Para cada grupo, verificar se o grupo não tem permissão nenhuma definida.
     * Caso realmente não tenha, verificar se o site possui permissão. Caso possua, enviar mensagem de erro. Caso não possua, mensagem de sucesso de que realmente não deveria ter permissões.
     * Caso o grupo tenha permissões definidas, verificar se a entidade possui alguma permissão para esse grupo, caso não tiver, enviar mensagem de erro dizendo que grupo não possui permissão onde na verdade deveria ter
     * Caso o grupo tenha permissões definidas, verificar se possui os mesmos níveis de permissão da definição. Caso tenha, enviar mensagem de sucesso, caso não tenha, enviar mensagem de erro dizendo que as permissões estão diferentes.
     * 
     * Também verificar o tamanho de grupos com definição na entidade e a quantidade real de permissões que a entidade possui. Caso números diferentes, enviar menagem de erro.
     */

    let reports = [];

    const report = {
      IdDefinicao: item.Id,
      Site: item.URLSite.URLSite,
      Entidade: item.TipoEntidade,
      NomeEntidade: obterNomeEntidade(item),
      Lista: null,
      IdItem: item.Title,
      Verificacao: null,
      HerdaPermissao: true,
      DeveriaHerdarPermissao: true,
      TemPermissao: null,
      DeveriaTerPermissao: null,
      Erro: true,
      Mensagem: null
    }

    // Definindo os grupos que serão verificados na entidade.
    const groups: IGroupReport[] = obterGruposENiveisDefinicao(item, gruposCampos, niveisPermissoes);

    const RoleAss = {
      [`${TipoEntidade.Site}`]: item.SitePermissions.RoleAssignments,
      [`${TipoEntidade.Lista}`]: item?.ListPermissions?.RoleAssignments,
      [`${TipoEntidade.Item}`]: item?.ItemPermissions?.RoleAssignments,
    }
    const Role = RoleAss[item.TipoEntidade];
    let RoleAssignments: IRoleAssignment[] = Array.isArray(Role) && Role && Role?.length ? Role : [];
    RoleAssignments = RoleAssignments.filter(r => r.RoleDefinitionBindings.filter(d => d.Name !== "Acesso Limitado" && d.Name !== "Limited Access").length);

    const groupReports: any[] = groups.map((g: IGroupReport) => {

      const permOnSite = RoleAssignments.filter(r => r.Member.Title === g.Title)[0];
      const permOnSiteNames = permOnSite ? permOnSite.RoleDefinitionBindings.filter(r => r.Name !== "Acesso Limitado").map(r => r.Name).sort() : null
      const permOnSiteIds = permOnSite ? permOnSite.RoleDefinitionBindings.filter(r => r.Name !== "Acesso Limitado").map(r => r.Id).sort() : null

      // Verificar se grupo da definição está preenchido.
      if (g.RoleIds && g.RoleIds.length) {
        // Caso na definição esteja preenchido, verificar se grupo possui permissão no site.
        if (permOnSite) {
          // Caso possua, verificar se os níveis de permissões setados para ele no site estão iguais da definição.
          const Erro = !isSameArray(g?.RoleIds, permOnSiteIds);
          // Caso não possua permissão no site ou os níveis de permissões setados estejam diferentes, enviar um erro.
          const Mensagem = Erro ? `Grupo não possui as mesmas permissões na entidade. Deveria ter as permissões: ${joinAnd(g.RoleNames || [])}. Mas possui: ${joinAnd(permOnSiteNames || [])}` : "";

          return {
            ...report,
            Mensagem,
            Erro,
            Verificacao: `Grupo: "${g.Title}"`,
            DeveriaTerPermissao: joinAnd(g.RoleNames || []),
            TemPermissao: joinAnd(permOnSiteNames || []),
          };

        } else {
          // Caso não possua permissão no site ou os níveis de permissões setados estejam diferentes, enviar um erro.
          const Erro = !Boolean(permOnSite);
          const Mensagem = Erro ? "Grupo não possui permissão na entidade." : "";

          return {
            ...report,
            DeveriaTerPermissao: joinAnd(g.RoleNames || []),
            TemPermissao: joinAnd(permOnSiteNames || []),
            Verificacao: `Grupo: "${g.Title}"`,
            Erro,
            Mensagem
          };
        }
      }
      // Caso não esteja preenchido, verificar permissões no site.
      else {
        const Erro = Boolean(permOnSite);
        const Mensagem = Erro ? `O grupo está definido para não ter nenhuma permissão, entretanto a entidade possui permissão para esse grupo. As permissões: ${joinAnd(permOnSiteNames || [])}.` : "O grupo não possui permissão na entidade";
        if (Erro) return {
          ...report,
          Verificacao: `Grupo: "${g.Title}"`,
          Erro,
          Mensagem,
          DeveriaTerPermissao: "-- nenhuma --",
          TemPermissao: permOnSiteNames ? joinAnd(permOnSiteNames) : '-- nenhuma --',
        }
        else return null;
      }

    }).filter(i => i !== null) as IItemReport[];

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
    };

    reports = reports.concat(groupReports);
    return reports
  }

  function obterNomeEntidade(perm: ISiteDefinition) {

    const ListaBiblioteca = perm?.ListaBiblioteca?.Title || '';

    return perm.TipoEntidade === TipoEntidade.Site ?
      perm.SitePermissions.ServerRelativeUrl
      : (perm.TipoEntidade === TipoEntidade.Lista ?
        ListaBiblioteca
        : `${ListaBiblioteca} - ${perm.MetodoLocalizacaoItem} - "${perm.Title}"`
      );
  }

  function obterGruposENiveisDefinicao(perm: ISiteDefinition, gruposCampos: IPreDados['gruposCampos'], niveisPermissoes: IPreDados['niveisPermissoes']) {

    return gruposCampos.map(g => {

      const fieldSpId = perm[`${g.EntityPropertyName}Id` as keyof typeof perm];
      const roleDefSpIds = fieldSpId && (Array.isArray(fieldSpId) ? Boolean(fieldSpId.length) : true) ? [fieldSpId] : null
      const roleDefNames = roleDefSpIds ? roleDefSpIds.map((id) => niveisPermissoes[id]).sort() : null;
      const roleDefIds = roleDefNames ? roleDefNames.map(r => perm.SitePermissions.RoleDefinitions.filter(d => d.Name === r)[0]?.Id).sort() : null;

      return {
        Title: g.Title,
        RoleSpIds: roleDefSpIds,
        RoleNames: roleDefNames,
        RoleIds: roleDefIds,
      }
    });
  }

  function isSameArray(array1: any, array2: any) {
    try {
      if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
      const array2Sorted = array2.slice().sort();
      return array1.length === array2.length && array1.slice().sort().every((value, index) => {
        return value === array2Sorted[index];
      });

    } catch { return false }
  }

  function joinAnd(arr: any[]) {
    if (!arr || !Array.isArray(arr)) return null;
    return arr.join(', ').replace(/, ([^,]*)$/, ' e $1')
  }

  function gerarRelatorioHtml(relatorio: IItemReport[]): string {

    let html = "";
    const idsDefinicao = relatorio.map(i => i.IdDefinicao).filter(onlyUnique).filter(i => Boolean(i));

    idsDefinicao.forEach(id => {
      const relatorioAtual = relatorio.filter(d => d.IdDefinicao === id);

      relatorioAtual.forEach((r, idx) => {

        html += `<tr class=${idx !== relatorioAtual.length - 1 ? "'no_border_row'" : ""}>
          ${idx === 0 ? `<td rowspan=${relatorioAtual.length}>${id}</td>` : ""}
          ${idx === 0 ? `<td rowspan=${relatorioAtual.length}>${r.Site}</td>` : ""}
          ${idx === 0 ? `<td rowspan=${relatorioAtual.length}>${r.Entidade}</td>` : ""}
          ${idx === 0 ? `<td rowspan=${relatorioAtual.length}>${r.NomeEntidade}</td>` : ""}
          <td>${r.Verificacao || ""}</td>
          <td>${r.Erro ? '❌ Erro' : '✅ Ok'}</td>
          <td>${r.Mensagem || ""}</td>
          <td>${r.TemPermissao || ""}</td>
          <td>${r.DeveriaTerPermissao || ""}</td>
        </tr>`

      });
    });

    return html.replace(/(\r\n|\n|\r)/gm, "").replace(/\s\s+/g, ' ');
  }

  function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  function gerarRelatorioCsv(relatorio: IItemReport[]): string {

    const headers = Object.keys(relatorio[0]);
    const cells = relatorio.map(cell => {

      const values = headers.map(h => {
        let value = cell[h as keyof typeof cell];
        if (typeof value === 'string') value = `"${value}"`;
        return value
      });

      return values.join(',');

    }).join('\n');

    return headers.join(',') + '\n' + cells;
  }

  const EnviarApenasErro = true;
  const relatorio = gerarRelatorioPermissoes(preDados);
  const relatorioFiltrado = EnviarApenasErro ? relatorio.filter(d => d.Erro) : relatorio
  const relatorioHtml = gerarRelatorioHtml(relatorioFiltrado);
  const relatorioCsv = gerarRelatorioCsv(relatorioFiltrado)

  return { relatorioFiltrado, relatorioHtml, relatorioCsv }

}