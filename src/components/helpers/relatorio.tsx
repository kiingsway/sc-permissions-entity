enum TipoEntidade {
  Site = "Site",
  Lista = "Lista/Biblioteca",
  Item = "Pasta/Item de Lista/Biblioteca"
}

export default function gerarRelatorioPermissoes(dados: IPreDados) {

  // console.clear();

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
  const permissoes: IPermissions = todasPermissoes[item.TipoEntidade];

  const HerdaPermissao = !permissoes.HasUniqueRoleAssignments;
  const DeveriaHerdarPermissao = item.HerdaPermissoesPai;

  // Apenas verifica a herança de site for um subsite.
  const Erro = item.TipoEntidade === TipoEntidade.Site ?
    HerdaPermissao !== DeveriaHerdarPermissao && Boolean(item.SitePermissions.ParentWeb) :
    HerdaPermissao !== DeveriaHerdarPermissao;

  enum txt {
    herda = "herdando permissões do pai",
    unica = "com permissões exclusivas"
  }

  const cond = {
    herda: HerdaPermissao ? txt.herda : txt.unica,
    deveria: DeveriaHerdarPermissao ? txt.herda : txt.unica
  }

  const mensagens = {
    Erro: `${item.TipoEntidade} está ${cond.herda} e não deveria. O correto é estar ${cond.deveria}.`,
    EntMaxima: 'Não será necessário verificar herança de permissões pois essa entidade já é a entidade máxima (site)',
  }

  const ehEntidadeMaxima = !Boolean(item.SitePermissions?.ParentWeb) && item.TipoEntidade === TipoEntidade.Site
  // consoleGroup('ehEntidadeMaxima', ehEntidadeMaxima)

  const Mensagem = Erro ? mensagens.Erro : (ehEntidadeMaxima ? mensagens.EntMaxima : null);

  return [{
    IdDefinicao: item.Id,
    Site: item.URLSite.Title,
    Entidade: item.TipoEntidade,
    NomeEntidade: obterNomeEntidade(item),
    Verificacao: "Herança da permissão",
    HerdaPermissao,
    DeveriaHerdarPermissao,
    Lista: null,
    IdItem: null,
    TemPermissao: HerdaPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
    DeveriaTerPermissao: DeveriaHerdarPermissao ? "Herdar permissões do pai" : "Permissões exclusivas",
    Erro,
    Mensagem
  }]

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

  let reports: IItemReport[] = [];

  const report: IItemReport = {
    IdDefinicao: item.Id,
    Site: item.URLSite.Title,
    Entidade: item.TipoEntidade,
    NomeEntidade: obterNomeEntidade(item),
    Verificacao: null,
    HerdaPermissao: true,
    DeveriaHerdarPermissao: true,
    Lista: null,
    IdItem: null,
    TemPermissao: null,
    DeveriaTerPermissao: null,
    Erro: true,
    Mensagem: null
  }

  // Definindo os grupos que serão verificados na entidade.
  const groups = obterGruposENiveisDefinicao(item, gruposCampos, niveisPermissoes);

  const RoleAss = {
    [`${TipoEntidade.Site}`]: item.SitePermissions.RoleAssignments,
    [`${TipoEntidade.Lista}`]: item?.ListPermissions?.RoleAssignments,
    [`${TipoEntidade.Item}`]: item?.ItemPermissions?.RoleAssignments,
  }
  const Role = RoleAss[item.TipoEntidade];
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

    const fieldSpId: number | null = perm[`${g.EntityPropertyName}Id` as keyof typeof perm];
    const roleDefSpIds = fieldSpId && (Array.isArray(fieldSpId) ? Boolean(fieldSpId.length) : true) ? [fieldSpId] : null
    const roleDefNames = roleDefSpIds ? roleDefSpIds.map((id: number) => niveisPermissoes[id]).sort() : null;
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

function joinAnd(arr: any) {
  if (!arr || !Array.isArray(arr)) return null;
  return arr.join(', ').replace(/, ([^,]*)$/, ' e $1')
}